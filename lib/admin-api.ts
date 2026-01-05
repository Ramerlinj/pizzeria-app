import { MenuItem, Ingredient } from "@/data/menu";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper to get auth headers
const getAuthHeaders = () => {
    return {
        'Accept': 'application/json',
        // 'Authorization': `Bearer ${token}`, // Implement token retrieval if needed
    };
};

// Helper to convert Base64 to Blob
const base64ToBlob = async (base64: string): Promise<Blob> => {
    const res = await fetch(base64);
    return await res.blob();
};

// --- Products ---

export const getProducts = async (): Promise<MenuItem[]> => {
    const res = await fetch(`${API_URL}/products`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    // Handle various response structures based on backend implementation
    let productsList: any[] = [];
    if (Array.isArray(data)) {
        productsList = data;
    } else if (Array.isArray(data.data)) {
        productsList = data.data;
    } else if (data.products && Array.isArray(data.products)) {
        productsList = data.products;
    } else if (data.products && data.products.products && Array.isArray(data.products.products)) {
        // Handles nested structure: { products: { products: [...] } }
        productsList = data.products.products;
    }

    return productsList.map((p: any) => {
        // Handle image_url being an object (e.g. media library) or string
        let imageUrl = "/pizzas/pizza-home-1.webp"; // Default fallback
        if (typeof p.image_url === 'string') {
            imageUrl = p.image_url;
        } else if (typeof p.image === 'string') {
            imageUrl = p.image;
        } else if (typeof p.image_url === 'object' && p.image_url !== null) {
            // Try to find a url property in the object
            imageUrl = p.image_url.url || p.image_url.original_url || p.image_url.path || imageUrl;
        }

        return {
            ...p,
            price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
            image_url: imageUrl,
            type_product: p.type_product,
            is_recommended: !!p.is_recommended,
        };
    });
};

export const getProduct = async (id: number): Promise<MenuItem | undefined> => {
    // Fallback: Fetch all products and find the one we need, since GET /products/:id is not supported
    const products = await getProducts();
    const product = products.find((p) => p.id === id);

    if (!product) return undefined;

    const ingredientsRes = await fetch(`${API_URL}/products/${id}/ingredients`, {
        headers: getAuthHeaders(),
    });
    let ingredientIds: number[] = [];
    if (ingredientsRes.ok) {
        const ingredientsData = await ingredientsRes.json();
        // Handle ingredients structure
        const ingredientsList = Array.isArray(ingredientsData.data) ? ingredientsData.data : (Array.isArray(ingredientsData) ? ingredientsData : []);
        ingredientIds = ingredientsList.map((i: any) => i.id);
    }

    return {
        ...product,
        ingredients: ingredientIds,
    };
};

export const createProduct = async (product: Omit<MenuItem, "id">): Promise<MenuItem> => {
    const formData = new FormData();
    formData.append("name", product.name);
    if (product.description) formData.append("description", product.description);
    formData.append("price", product.price.toString());
    formData.append("type_product", product.type_product);
    formData.append("is_recommended", product.is_recommended ? "1" : "0");
    if (product.badge) formData.append("badge", product.badge);

    if (product.image_url && product.image_url.startsWith("data:")) {
        const imageBlob = await base64ToBlob(product.image_url);
        formData.append("image", imageBlob, "product-image.png");
    }

    const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            ...getAuthHeaders(),
        },
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create product");
    }

    const data = await res.json();
    const newProduct = data.data || data;

    if (product.ingredients && product.ingredients.length > 0) {
        for (const ingredientId of product.ingredients) {
            await fetch(`${API_URL}/products/${newProduct.id}/ingredients`, {
                method: "POST",
                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ingredient_id: ingredientId }),
            });
        }
    }

    return newProduct;
};

export const updateProduct = async (id: number, product: Partial<MenuItem>): Promise<MenuItem | undefined> => {
    const formData = new FormData();
    formData.append("_method", "PUT");

    if (product.name) formData.append("name", product.name);
    if (product.description) formData.append("description", product.description);
    if (product.price !== undefined) formData.append("price", product.price.toString());
    if (product.type_product) formData.append("type_product", product.type_product);
    if (product.is_recommended !== undefined) formData.append("is_recommended", product.is_recommended ? "1" : "0");
    if (product.badge !== undefined) formData.append("badge", product.badge || "");

    if (product.image_url && product.image_url.startsWith("data:")) {
        const imageBlob = await base64ToBlob(product.image_url);
        formData.append("image", imageBlob, "product-image.png");
    }

    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "POST",
        headers: {
            ...getAuthHeaders(),
        },
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error("Update Product Error:", errorData);
        throw new Error(errorData.message || "Failed to update product");
    }
    const data = await res.json();
    const updatedProduct = data.data || data; // Handle wrapped or unwrapped response

    // Handle image url extraction for updated product
    let imageUrl = "/pizzas/pizza-home-1.webp";
    if (typeof updatedProduct.image_url === 'string') {
        imageUrl = updatedProduct.image_url;
    } else if (typeof updatedProduct.image === 'string') {
        imageUrl = updatedProduct.image;
    } else if (typeof updatedProduct.image_url === 'object' && updatedProduct.image_url !== null) {
        imageUrl = updatedProduct.image_url.url || updatedProduct.image_url.original_url || imageUrl;
    }

    const finalProduct = {
        ...updatedProduct,
        price: typeof updatedProduct.price === 'string' ? parseFloat(updatedProduct.price) : updatedProduct.price,
        image_url: imageUrl,
        is_recommended: !!updatedProduct.is_recommended,
    };

    if (product.ingredients) {
        const currentIngredientsRes = await fetch(`${API_URL}/products/${id}/ingredients`, {
            headers: getAuthHeaders(),
        });

        if (currentIngredientsRes.ok) {
            const currentData = await currentIngredientsRes.json();
            const currentIngredients = currentData.data;

            const newIngredientIds = new Set(product.ingredients);
            const currentIngredientIds = new Set(currentIngredients.map((i: any) => i.id));

            for (const ingId of product.ingredients) {
                if (!currentIngredientIds.has(ingId)) {
                    await fetch(`${API_URL}/products/${id}/ingredients`, {
                        method: "POST",
                        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
                        body: JSON.stringify({ ingredient_id: ingId }),
                    });
                }
            }

            for (const ing of currentIngredients) {
                if (!newIngredientIds.has(ing.id)) {
                    // Try to use pivot ID if available, otherwise fallback to ingredient ID (though likely incorrect for this endpoint)
                    const pivotId = ing.pivot?.id || ing.id;
                    await fetch(`${API_URL}/products/${id}/ingredients/${pivotId}`, {
                        method: "DELETE",
                        headers: getAuthHeaders(),
                    });
                }
            }
        }
    }

    return finalProduct;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
    // Note: The provided API documentation does not explicitly show a DELETE /api/products/{id} endpoint.
    // We will try to call it, but if it fails with 404 or 405, it means the API doesn't support it.
    const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        console.warn("Delete product failed. Endpoint might not exist.");
        return false;
    }
    return res.ok;
};

// --- Ingredients ---

export const getIngredients = async (): Promise<Ingredient[]> => {
    const res = await fetch(`${API_URL}/ingredients`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch ingredients");
    const data = await res.json();

    let ingredientsList: any[] = [];
    if (Array.isArray(data)) {
        ingredientsList = data;
    } else if (Array.isArray(data.data)) {
        ingredientsList = data.data;
    } else if (data.ingredients && Array.isArray(data.ingredients)) {
        ingredientsList = data.ingredients;
    }

    return ingredientsList.map((i: any) => ({
        ...i,
        price: typeof i.price === 'string' ? parseFloat(i.price) : i.price,
        type: i.ingredient,
    }));
};

export const createIngredient = async (ingredient: Omit<Ingredient, "id">): Promise<Ingredient> => {
    const formData = new FormData();
    formData.append("name", ingredient.name);
    formData.append("price", ingredient.price.toString());
    formData.append("ingredient", ingredient.type);
    formData.append("available", ingredient.available ? "1" : "0");

    const dummyBlob = new Blob([""], { type: "image/png" });
    formData.append("image", dummyBlob, "placeholder.png");

    const res = await fetch(`${API_URL}/ingredients`, {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create ingredient");
    }

    const data = await res.json();
    return { ...data.data, type: data.data.ingredient };
};

export const updateIngredient = async (id: number, ingredient: Partial<Ingredient>): Promise<Ingredient | undefined> => {
    const formData = new FormData();
    formData.append("_method", "PUT");

    if (ingredient.name) formData.append("name", ingredient.name);
    if (ingredient.price !== undefined) formData.append("price", ingredient.price.toString());
    if (ingredient.type) formData.append("ingredient", ingredient.type);
    if (ingredient.available !== undefined) formData.append("available", ingredient.available ? "1" : "0");

    const res = await fetch(`${API_URL}/ingredients/${id}`, {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
    });

    if (!res.ok) throw new Error("Failed to update ingredient");
    const data = await res.json();
    return { ...data.data, type: data.data.ingredient };
};

export const deleteIngredient = async (id: number): Promise<boolean> => {
    const res = await fetch(`${API_URL}/ingredients/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    return res.ok;
};
