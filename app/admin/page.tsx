import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { menuItems } from "@/data/menu";
import { Pizza } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-huerto-verde/20 bg-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-huerto-texto">
            Total Productos
          </CardTitle>
          <Pizza className="h-4 w-4 text-huerto-verde" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-huerto-texto">
            {menuItems.length}
          </div>
          <p className="text-xs text-muted-foreground">
            +2 desde el último mes
          </p>
        </CardContent>
      </Card>
      {/* Add more cards as needed */}
    </div>
  );
}
