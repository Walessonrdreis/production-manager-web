import { Product } from "../../../../types/api";
import {
  Package,
  Trash2,
  Edit,
  AlertTriangle,
  FilePlus2,
  Layers,
  CheckSquare,
  Tag,
  Target,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { useSectors } from "../../../../hooks/sectors/useSectors";
import { useState } from "react";
import { Modal } from "../../../../components/ui/Modal";

import { GoalPeriod } from "../../../goals/domain/Goal";

interface MyProductsTableProps {
  products: Product[];
  demandMap?: Record<string, number>;
  onRemoveProduct: (id: string) => void;
  onViewDetails: (product: Product) => void;
  onPlanProduct?: (product: Product) => void;
  onUpdateBulkMinStock?: (
    productIds: string[],
    minStock: number,
  ) => Promise<void>;
  onUpdateBulkCategory?: (
    productIds: string[],
    category: string,
  ) => Promise<void>;
  onUpdateBulkSectors?: (
    productIds: string[],
    sectorIds: string[],
  ) => Promise<void>;
  onUpdateBulkGoals?: (
    productIds: string[],
    sectorId: string,
    quantity: number,
    period: GoalPeriod,
  ) => Promise<void>;
  onBulkPlanProducts?: (productIds: string[]) => Promise<void>;
}

export function MyProductsTable({
  products,
  demandMap = {},
  onRemoveProduct,
  onViewDetails,
  onPlanProduct,
  onUpdateBulkMinStock,
  onUpdateBulkCategory,
  onUpdateBulkSectors,
  onUpdateBulkGoals,
  onBulkPlanProducts,
}: MyProductsTableProps) {
  const { data: sectors = [] } = useSectors();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkMinStockModalOpen, setIsBulkMinStockModalOpen] = useState(false);
  const [bulkMinStockValue, setBulkMinStockValue] = useState<number>(0);
  const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
  const [bulkCategoryValue, setBulkCategoryValue] = useState<string>("Nenhuma");

  // Setores em massa
  const [isBulkSectorsModalOpen, setIsBulkSectorsModalOpen] = useState(false);
  const [bulkSectorIds, setBulkSectorIds] = useState<string[]>([]);

  // Metas em massa
  const [isBulkGoalsModalOpen, setIsBulkGoalsModalOpen] = useState(false);
  const [bulkGoalSector, setBulkGoalSector] = useState<string>("");
  const [bulkGoalQuantity, setBulkGoalQuantity] = useState<number>(0);
  const [bulkGoalPeriod, setBulkGoalPeriod] = useState<GoalPeriod>("monthly");

  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleToggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(products.map((p) => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const selectedCount = selectedIds.size;
  const allSelected = products.length > 0 && selectedCount === products.length;
  const isIndeterminate = selectedCount > 0 && selectedCount < products.length;

  const handleApplyBulkMinStock = async () => {
    if (!onUpdateBulkMinStock || selectedCount === 0) return;
    setIsUpdatingBulk(true);
    try {
      await onUpdateBulkMinStock(Array.from(selectedIds), bulkMinStockValue);
      setSelectedIds(new Set());
      setIsBulkMinStockModalOpen(false);
      setBulkMinStockValue(0);
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  const handleApplyBulkCategory = async () => {
    if (!onUpdateBulkCategory || selectedCount === 0) return;
    setIsUpdatingBulk(true);
    try {
      await onUpdateBulkCategory(
        Array.from(selectedIds),
        bulkCategoryValue === "Nenhuma" ? "" : bulkCategoryValue,
      );
      setSelectedIds(new Set());
      setIsBulkCategoryModalOpen(false);
      setBulkCategoryValue("Nenhuma");
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  const handleApplyBulkSectors = async () => {
    if (!onUpdateBulkSectors || selectedCount === 0) return;
    setIsUpdatingBulk(true);
    try {
      await onUpdateBulkSectors(Array.from(selectedIds), bulkSectorIds);
      setSelectedIds(new Set());
      setIsBulkSectorsModalOpen(false);
      setBulkSectorIds([]);
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  const handleApplyBulkGoals = async () => {
    if (!onUpdateBulkGoals || selectedCount === 0 || bulkGoalQuantity <= 0)
      return;
    setIsUpdatingBulk(true);
    try {
      await onUpdateBulkGoals(
        Array.from(selectedIds),
        bulkGoalSector || sectors[0]?.id || "",
        bulkGoalQuantity,
        bulkGoalPeriod,
      );
      setSelectedIds(new Set());
      setIsBulkGoalsModalOpen(false);
      setBulkGoalQuantity(0);
      setBulkGoalSector("");
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  const handleApplyBulkPlan = async () => {
    if (!onBulkPlanProducts || selectedCount === 0) return;
    setIsUpdatingBulk(true);
    try {
      await onBulkPlanProducts(Array.from(selectedIds));
      setSelectedIds(new Set());
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Ações em Massa */}
      {selectedCount > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 text-indigo-700">
            <CheckSquare size={18} />
            <span className="text-sm font-bold">
              {selectedCount}{" "}
              {selectedCount === 1
                ? "produto selecionado"
                : "produtos selecionados"}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              className="bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setIsBulkSectorsModalOpen(true)}
            >
              <Layers size={14} className="mr-2" />
              Setores
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-rose-500 hover:bg-rose-600 text-white"
              onClick={() => setIsBulkGoalsModalOpen(true)}
            >
              <Target size={14} className="mr-2" />
              Metas
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleApplyBulkPlan}
              isLoading={isUpdatingBulk}
            >
              <FilePlus2 size={14} className="mr-2" />
              Planejar
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setIsBulkMinStockModalOpen(true)}
            >
              <Package size={14} className="mr-2" />
              Estq. Mínimo
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setIsBulkCategoryModalOpen(true)}
            >
              <Tag size={14} className="mr-2" />
              Categoria
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {products.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            Nenhum produto encontrado.
          </div>
        ) : (
          products.map((p) => {
            const productCode = String(p.code || p.id || p.description);
            const demand = demandMap[productCode] || 0;
            const stock = p.stock || 0;
            const deficit = stock - demand;

            const minStock = p.minStock || 0;
            const isCritical = deficit < 0;
            const isWarning =
              !isCritical &&
              ((stock <= minStock && minStock > 0) ||
                (demand > 0 && deficit <= minStock));

            const isSelected = selectedIds.has(p.id);

            return (
              <div
                key={p.id}
                onClick={() => onViewDetails(p)}
                className={`group flex flex-col md:flex-row md:items-center justify-between p-3 md:px-4 gap-3 md:gap-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative ${
                  isSelected
                    ? "ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50/30"
                    : isCritical
                      ? "hover:border-red-300"
                      : isWarning
                        ? "hover:border-amber-300"
                        : "hover:border-indigo-100"
                }`}
              >
                {/* Produto Info */}
                <div className="flex items-center gap-3 w-full md:w-[40%] min-w-0 shrink">
                  <div
                    className="pt-0.5 select-none shrink-0"
                    onClick={(e) => handleToggleSelect(p.id, e)}
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                      checked={isSelected}
                      readOnly
                      aria-label={`Selecionar produto ${p.code}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md w-max ${isCritical ? "text-red-700 bg-red-100" : isWarning ? "text-amber-700 bg-amber-100" : "text-blue-700 bg-blue-50"}`}
                    >
                      {p.code || p.id}
                    </span>
                    <div
                      className="flex items-center gap-1.5 min-w-0"
                      title={
                        isCritical
                          ? "Demanda supera o estoque atual!"
                          : isWarning
                            ? "Estoque no limite de segurança."
                            : undefined
                      }
                    >
                      <h3 className="text-sm font-bold text-slate-900 leading-tight uppercase truncate">
                        {p.description}
                      </h3>
                      {isCritical && (
                        <AlertTriangle
                          size={14}
                          className="text-red-500 shrink-0"
                        />
                      )}
                      {isWarning && (
                        <AlertTriangle
                          size={14}
                          className="text-amber-500 shrink-0"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Classificação */}
                <div className="flex flex-col gap-1 items-start w-full md:w-[25%] shrink-0 min-w-0">
                  {p.family && (
                    <span className="text-[10px] font-bold text-slate-500 uppercase leading-none truncate w-full">
                      Família: {p.family}
                    </span>
                  )}
                  {(p.category || minStock > 0) && (
                    <div className="flex flex-wrap gap-1.5 items-center w-full">
                      {p.category && (
                        <span className="text-[10px] font-bold text-emerald-600 uppercase leading-none shrink-0 truncate max-w-[120px]">
                          Cat: {p.category}
                        </span>
                      )}
                      {minStock > 0 && (
                        <span className="text-[10px] font-bold text-indigo-500 uppercase leading-none shrink-0">
                          Mín: {minStock}
                        </span>
                      )}
                    </div>
                  )}
                  {(p.sectorIds || []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-0.5 w-full max-h-[22px] overflow-hidden">
                      {(p.sectorIds || []).map((sId) => {
                        const sectorName =
                          sectors.find((s) => s.id === sId)?.name || sId;
                        return (
                          <span
                            key={sId}
                            className="flex items-center text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 uppercase px-1.5 py-0.5 rounded shrink-0"
                          >
                            <Layers size={10} className="mr-1" />
                            {sectorName}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Valores e Ações */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between w-full md:w-[35%] pt-3 border-t border-slate-100 md:border-t-0 md:pt-0 gap-3 shrink-0">
                  <div className="flex flex-col items-start md:items-end flex-1 min-w-[70px]">
                    {demand > 0 && (
                      <span
                        className={`text-[10px] font-bold leading-tight uppercase ${isCritical ? "text-red-600" : "text-amber-600"}`}
                        title="Demanda Pendente"
                      >
                        Deman: {demand}
                      </span>
                    )}
                    <div className="flex items-baseline space-x-1">
                      <span
                        className={`text-base leading-none font-black ${isCritical ? "text-red-600" : "text-slate-900"}`}
                      >
                        {stock}
                      </span>
                      <span className="text-[10px] uppercase text-slate-500 font-bold">
                        {p.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end whitespace-nowrap flex-1 min-w-[80px]">
                    <span className="text-sm font-bold text-slate-900">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(p.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-1 shrink-0 ml-auto bg-slate-50 md:bg-transparent rounded-lg p-1 md:p-0">
                    {onPlanProduct && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-500 md:text-slate-400 hover:text-amber-600 hover:bg-amber-100 md:hover:bg-amber-50 rounded-md md:rounded-full"
                        title="Planejar Produção"
                        aria-label={`Planejar produção para o produto ${p.code}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlanProduct(p);
                        }}
                      >
                        <FilePlus2 size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-slate-500 md:text-slate-400 hover:text-red-600 hover:bg-red-100 md:hover:bg-red-50 rounded-md md:rounded-full"
                      title="Remover produto"
                      aria-label={`Remover produto ${p.code}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveProduct(p.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={isBulkMinStockModalOpen}
        onClose={() => setIsBulkMinStockModalOpen(false)}
        title="Estoque Mínimo em Lote"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Defina o mesmo estoque mínimo para os{" "}
            <strong className="text-zinc-900">{selectedCount}</strong> produtos
            selecionados.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantidade Mínima
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={bulkMinStockValue}
                onChange={(e) => setBulkMinStockValue(Number(e.target.value))}
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsBulkMinStockModalOpen(false)}
                disabled={isUpdatingBulk}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleApplyBulkMinStock}
                isLoading={isUpdatingBulk}
              >
                Aplicar Mínimo
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBulkCategoryModalOpen}
        onClose={() => setIsBulkCategoryModalOpen(false)}
        title="Categoria em Lote"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Defina a categoria para os{" "}
            <strong className="text-zinc-900">{selectedCount}</strong> produtos
            selecionados.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoria Produtiva
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={bulkCategoryValue}
                onChange={(e) => setBulkCategoryValue(e.target.value)}
              >
                <option value="Nenhuma">Nenhuma</option>
                <option value="Vegano">Vegano</option>
                <option value="Ao leite">Ao leite</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsBulkCategoryModalOpen(false)}
                disabled={isUpdatingBulk}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleApplyBulkCategory}
                isLoading={isUpdatingBulk}
              >
                Aplicar Categoria
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBulkSectorsModalOpen}
        onClose={() => setIsBulkSectorsModalOpen(false)}
        title="Setores em Lote"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Defina os setores para os{" "}
            <strong className="text-zinc-900">{selectedCount}</strong> produtos
            selecionados.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto w-full">
              {sectors.map((sector) => (
                <label
                  key={sector.id}
                  className="flex items-center space-x-2 text-sm bg-white p-2 rounded border border-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={bulkSectorIds.includes(sector.id)}
                    onChange={(e) => {
                      if (e.target.checked)
                        setBulkSectorIds([...bulkSectorIds, sector.id]);
                      else
                        setBulkSectorIds(
                          bulkSectorIds.filter((id) => id !== sector.id),
                        );
                    }}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">
                    {sector.name}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsBulkSectorsModalOpen(false)}
                disabled={isUpdatingBulk}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleApplyBulkSectors}
                isLoading={isUpdatingBulk}
              >
                Aplicar Setores
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBulkGoalsModalOpen}
        onClose={() => setIsBulkGoalsModalOpen(false)}
        title="Metas em Lote"
      >
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-6">
            Defina uma meta produtiva para os{" "}
            <strong className="text-zinc-900">{selectedCount}</strong> produtos
            selecionados.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Setor
              </label>
              <select
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={bulkGoalSector}
                onChange={(e) => setBulkGoalSector(e.target.value)}
              >
                <option value="" disabled>
                  Selecione um setor...
                </option>
                {sectors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quantidade
                </label>
                <Input
                  type="number"
                  min="0"
                  value={bulkGoalQuantity || ""}
                  onChange={(e) => setBulkGoalQuantity(Number(e.target.value))}
                  placeholder="Ex: 500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Período
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  value={bulkGoalPeriod}
                  onChange={(e) =>
                    setBulkGoalPeriod(e.target.value as GoalPeriod)
                  }
                >
                  <option value="daily">Diária</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsBulkGoalsModalOpen(false)}
                disabled={isUpdatingBulk}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                onClick={handleApplyBulkGoals}
                isLoading={isUpdatingBulk}
                disabled={!bulkGoalSector || bulkGoalQuantity <= 0}
              >
                Atribuir Meta
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
