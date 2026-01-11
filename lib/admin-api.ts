"use client";

import { MenuItem, Ingredient } from "@/data/menu";
import { getToken } from "@/lib/auth-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === "object" && value !== null;

const toNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = parseFloat(value);
        return Number.isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
};

const getAuthHeaders = (opts?: { json?: boolean }) => {
    const token = getToken();
    const headers: Record<string, string> = {
        Accept: "application/json",
    };
    if (opts?.json) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
};

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

    let productsList: unknown[] = [];
    if (Array.isArray(data)) {
        productsList = data;
    } else if (isRecord(data) && Array.isArray(data.data)) {
        productsList = data.data;
    } else if (isRecord(data) && Array.isArray(data.products)) {
        productsList = data.products;
    } else if (
        isRecord(data) &&
        isRecord(data.products) &&
        Array.isArray((data.products as UnknownRecord).products)
    ) {
        productsList = (data.products as UnknownRecord).products as unknown[];
    }

    return productsList.map((raw) => {
        const p = isRecord(raw) ? raw : {};
        let imageUrl = "/pizzas/pizza-home-1.webp";
        if (typeof p.image_url === "string") {
            imageUrl = p.image_url;
        } else if (typeof p.image === "string") {
            imageUrl = p.image;
        } else if (isRecord(p.image_url)) {
            imageUrl =
                (p.image_url.url as string) ||
                (p.image_url.original_url as string) ||
                (p.image_url.path as string) ||
                imageUrl;
        }

        return {
            ...(p as UnknownRecord),
            price: toNumber(p.price, 0),
            image_url: imageUrl,
            type_product: (p.type_product as MenuItem["type_product"]) || "pizza",
            is_recommended: Boolean(p.is_recommended),
        } as MenuItem;
    });
};

export const getProductIngredients = async (id: number): Promise<number[]> => {
    const res = await fetch(`${API_URL}/products/${id}/ingredients`, {
        headers: getAuthHeaders(),
        cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: unknown[] = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
            ? data
            : [];
    return list
        .map((item) => {
            if (!isRecord(item)) return null;
            const rawId = item.id ?? (item as UnknownRecord).ingredient_id;
            const numId = toNumber(rawId, NaN);
            return Number.isFinite(numId) ? numId : null;
        })
        .filter((num): num is number => num !== null);
};

export const getProduct = async (id: number): Promise<MenuItem | undefined> => {
    const products = await getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) return undefined;

    const ingredientsRes = await fetch(`${API_URL}/products/${id}/ingredients`, {
        headers: getAuthHeaders(),
    });
    let ingredientIds: number[] = [];
    if (ingredientsRes.ok) {
        const ingredientsData = await ingredientsRes.json();
        const ingredientsList: unknown[] = Array.isArray(ingredientsData?.data)
            ? ingredientsData.data
            : Array.isArray(ingredientsData)
                ? ingredientsData
                : [];
        ingredientIds = ingredientsList
            .map((i) => {
                if (!isRecord(i)) return null;
                const rawId = i.id ?? (i as UnknownRecord).ingredient_id;
                const numId = toNumber(rawId, NaN);
                return Number.isFinite(numId) ? numId : null;
            })
            .filter((num): num is number => num !== null);
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
        headers: { ...getAuthHeaders() },
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = (errorData as UnknownRecord).message as string | undefined;
        throw new Error(message || "Failed to create product");
    }

    const data = await res.json();
    const newProduct = (data as UnknownRecord).data || data;

    if (product.ingredients && product.ingredients.length > 0) {
        for (const ingredientId of product.ingredients) {
            await fetch(`${API_URL}/products/${(newProduct as UnknownRecord).id}/ingredients`, {
                method: "POST",
                headers: getAuthHeaders({ json: true }),
                body: JSON.stringify({ ingredient_id: ingredientId }),
            });
        }
    }

    return newProduct as MenuItem;
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
        headers: { ...getAuthHeaders() },
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = (errorData as UnknownRecord).message as string | undefined;
        throw new Error(message || "Failed to update product");
    }

    const data = await res.json();
    const updatedProduct = (data as UnknownRecord).data || data;

    let imageUrl = "/pizzas/pizza-home-1.webp";
    if (isRecord(updatedProduct)) {
        if (typeof updatedProduct.image_url === "string") {
            imageUrl = updatedProduct.image_url;
        } else if (typeof updatedProduct.image === "string") {
            imageUrl = updatedProduct.image;
        } else if (isRecord(updatedProduct.image_url)) {
            imageUrl =
                (updatedProduct.image_url.url as string) ||
                (updatedProduct.image_url.original_url as string) ||
                imageUrl;
        }
    }

    const finalProduct: MenuItem = {
        ...(updatedProduct as UnknownRecord),
        price: toNumber((updatedProduct as UnknownRecord).price, 0),
        image_url: imageUrl,
        is_recommended: Boolean((updatedProduct as UnknownRecord).is_recommended),
    } as MenuItem;

    if (product.ingredients) {
        const currentIngredientsRes = await fetch(`${API_URL}/products/${id}/ingredients`, {
            headers: getAuthHeaders(),
        });

        if (currentIngredientsRes.ok) {
            const currentData = await currentIngredientsRes.json();
            const currentIngredients: UnknownRecord[] = Array.isArray(currentData?.data)
                ? (currentData.data as UnknownRecord[])
                : [];

            const newIngredientIds = new Set(product.ingredients);
            const currentIngredientIds = new Set(
                currentIngredients
                    .map((i) => (typeof i.id === "number" ? i.id : null))
                    .filter((num): num is number => num !== null)
            );

            for (const ingId of product.ingredients) {
                if (!currentIngredientIds.has(ingId)) {
                    await fetch(`${API_URL}/products/${id}/ingredients`, {
                        method: "POST",
                        headers: getAuthHeaders({ json: true }),
                        body: JSON.stringify({ ingredient_id: ingId }),
                    });
                }
            }

            for (const ing of currentIngredients) {
                const ingId = typeof ing.id === "number" ? ing.id : null;
                if (!ingId || newIngredientIds.has(ingId)) continue;
                const pivotId = isRecord(ing.pivot) && typeof ing.pivot.id === "number"
                    ? ing.pivot.id
                    : ingId;
                await fetch(`${API_URL}/products/${id}/ingredients/${pivotId}`, {
                    method: "DELETE",
                    headers: getAuthHeaders(),
                });
            }
        }
    }

    return finalProduct;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
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

    let ingredientsList: unknown[] = [];
    if (Array.isArray(data)) {
        ingredientsList = data;
    } else if (isRecord(data) && Array.isArray(data.data)) {
        ingredientsList = data.data;
    } else if (isRecord(data) && Array.isArray(data.ingredients)) {
        ingredientsList = data.ingredients;
    }

    return ingredientsList.map((i) => {
        const ing = isRecord(i) ? i : {};
        const idValue = isRecord(i)
            ? toNumber(i.id ?? (i as UnknownRecord).ingredient_id, 0)
            : 0;
        return {
            ...(ing as UnknownRecord),
            id: idValue,
            price: toNumber(ing.price, 0),
            available: Boolean((ing as UnknownRecord).available ?? true),
            type: (ing.ingredient as Ingredient["type"]) || "extra",
        } as Ingredient;
    });
};

export const createIngredient = async (ingredient: Omit<Ingredient, "id">): Promise<Ingredient> => {
    const payload = {
        name: ingredient.name,
        price: ingredient.price,
        ingredient: ingredient.type,
        available: ingredient.available ? 1 : 0,
    };

    const res = await fetch(`${API_URL}/ingredients`, {
        method: "POST",
        headers: getAuthHeaders({ json: true }),
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = (errorData as UnknownRecord).message as string | undefined;
        throw new Error(message || "Failed to create ingredient");
    }

    const data = await res.json();
    const raw = (data as UnknownRecord).data ?? data;
    if (!isRecord(raw)) {
        throw new Error("Respuesta inválida al crear ingrediente");
    }
    return {
        ...(raw as UnknownRecord),
        price: toNumber(raw.price, ingredient.price),
        available: Boolean(raw.available ?? ingredient.available),
        type: (raw.ingredient as Ingredient["type"]) || ingredient.type,
    } as Ingredient;
};

export const updateIngredient = async (id: number, ingredient: Partial<Ingredient>): Promise<Ingredient | undefined> => {
    const payload: Record<string, unknown> = {
        _method: "PUT",
    };
    if (ingredient.name) payload.name = ingredient.name;
    if (ingredient.price !== undefined) payload.price = ingredient.price;
    if (ingredient.type) payload.ingredient = ingredient.type;
    if (ingredient.available !== undefined) payload.available = ingredient.available ? 1 : 0;

    const res = await fetch(`${API_URL}/ingredients/${id}`, {
        method: "POST",
        headers: getAuthHeaders({ json: true }),
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = (errorData as UnknownRecord).message as string | undefined;
        throw new Error(message || "Failed to update ingredient");
    }
    const data = await res.json();
    const raw = (data as UnknownRecord).data ?? data;
    if (!isRecord(raw)) {
        throw new Error("Respuesta inválida al actualizar ingrediente");
    }
    return {
        ...(raw as UnknownRecord),
        price: toNumber(raw.price, typeof ingredient.price === "number" ? ingredient.price : 0),
        available: Boolean(raw.available ?? ingredient.available),
        type: (raw.ingredient as Ingredient["type"]) || ingredient.type || "extra",
    } as Ingredient;
};

export const deleteIngredient = async (id: number): Promise<boolean> => {
    const res = await fetch(`${API_URL}/ingredients/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    return res.ok;
};
