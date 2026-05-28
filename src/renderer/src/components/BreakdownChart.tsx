import React, { useState, useMemo, useCallback } from "react";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { chartConfig } from "@/constants/piechart-config";
import { useCurrency } from "@/stores/use-currency";
import { formatCurrency as formatCurrencyUtil } from "@/lib/format-currency";
import { Label } from "./ui/label";

interface Props {
  data: CategoryPercentage[] | null;
  transactionType: "expense" | "income";
}

interface FormattedDataEntry {
  category: string;
  slug: string;
  total: number;
  percentage: number;
  fill: string;
}

function formatPercentage(value: number): string {
  const formatted = value % 1 === 0 ? value.toString() : value.toFixed(2);
  return `${formatted}%`;
}

function BreakdownChart({ data, transactionType }: Props): React.JSX.Element {
  const { currency } = useCurrency();
  const [hoveredIndex, setHoveredIndex] = useState<number | undefined>(
    undefined,
  );

  const formattedData = useMemo((): FormattedDataEntry[] | undefined => {
    if (!data || data.length === 0) return undefined;
    return data.map(
      (d): FormattedDataEntry => ({
        category: d.category,
        slug: d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, "_"),
        total: d.category_total,
        percentage: parseFloat(String(d.percentage)),
        fill: `var(--color-${d.category.toLowerCase().replace(/[^A-Z0-9]+/gi, "_")})`,
      }),
    );
  }, [data]);

  const totalAmount = useMemo((): number => {
    if (!formattedData) return 0;
    return formattedData.reduce((sum, entry) => sum + entry.total, 0);
  }, [formattedData]);

  const fmtCurrency = useCallback(
    (amount: number): string => formatCurrencyUtil(amount, currency.symbol),
    [currency.symbol],
  );

  const renderLegend = useMemo((): React.ReactNode => {
    if (!formattedData || formattedData.length === 0) return null;
    return (
      <div className="shrink-0 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1.5 text-xs px-4 pt-3 border-t mt-1">
        {formattedData.map((entry: FormattedDataEntry) => (
          <div key={entry.category} className="flex items-center gap-2 min-w-0">
            <div
              className="w-2 h-2 rounded-full shrink-"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="truncate text-muted-foreground flex-1">
              {chartConfig[entry.slug]?.label || entry.category}
            </span>
            <span className="font-semibold tabular-nums text-foreground">
              {formatPercentage(entry.percentage)}
            </span>
          </div>
        ))}
      </div>
    );
  }, [formattedData]);

  const onMouseEnter = useCallback((_data: unknown, index: number) => {
    setHoveredIndex(index);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHoveredIndex(undefined);
  }, []);

  return (
    <Card className="flex flex-col w-full h-100 shadow-none overflow-hidden">
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-lg font-semibold">
          {transactionType === "expense"
            ? "Expenses Breakdown"
            : "Income Breakdown"}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0 p-0 pb-3 -translate-y-3">
        {formattedData !== undefined && formattedData.length >= 1 ? (
          <>
            <div className="flex-1 min-h-0 w-full relative">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <PieChart>
                  <ChartTooltip
                    cursor={true}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const item = payload[0];
                      const entry = item.payload as FormattedDataEntry;
                      const color = entry.fill;
                      const label =
                        chartConfig[entry.slug]?.label || entry.category;
                      return (
                        <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-muted-foreground">
                              {label}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span>{fmtCurrency(entry.total)}</span>
                            <span className="font-medium tabular-nums">
                              {formatPercentage(entry.percentage)}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Pie
                    data={formattedData}
                    dataKey="percentage"
                    nameKey="slug"
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={2}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {formattedData.map(
                      (entry: FormattedDataEntry, index: number) => (
                        <Cell
                          key={`cell-${entry.category}`}
                          fill={entry.fill}
                          opacity={
                            hoveredIndex === undefined || hoveredIndex === index
                              ? 1
                              : 0.35
                          }
                          onMouseEnter={() => onMouseEnter(undefined, index)}
                          onMouseLeave={onMouseLeave}
                          style={{ transition: "opacity 0.2s ease" }}
                        />
                      ),
                    )}
                  </Pie>
                  {/*Outter ring on hover*/}
                  {hoveredIndex !== undefined && (
                    <Pie
                      data={formattedData}
                      dataKey="percentage"
                      nameKey="slug"
                      cx="50%"
                      cy="50%"
                      innerRadius="83%"
                      outerRadius="87%"
                      paddingAngle={2}
                      isAnimationActive={false}
                    >
                      {formattedData.map(
                        (entry: FormattedDataEntry, index: number) => (
                          <Cell
                            key={`ring-${entry.category}`}
                            fill={
                              index === hoveredIndex
                                ? entry.fill
                                : "transparent"
                            }
                            stroke={
                              index === hoveredIndex
                                ? "hsl(var(--background))"
                                : "transparent"
                            }
                            strokeWidth={2}
                            opacity={index === hoveredIndex ? 0.85 : 0}
                          />
                        ),
                      )}
                    </Pie>
                  )}
                </PieChart>
              </ChartContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold tabular-nums drop-shadow-sm">
                  {fmtCurrency(totalAmount)}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
                  Total
                </span>
              </div>
            </div>
            {renderLegend}
          </>
        ) : (
          <div className="flex flex-1 p-10 justify-center items-center">
            <Label className="opacity-50">No breakdown available.</Label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BreakdownChart;
