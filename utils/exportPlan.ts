import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { AdvancedResult } from "./calculator/calculatePlan";

pdfMake.vfs = pdfFonts.vfs;

export const exportPlan = ({
  results,
  aiPlan,
}: {
  results: AdvancedResult;
  aiPlan: string | null;
}) => {
  // Build hourly rows
  const hourlyRows = [
    [
      { text: "Hour", style: "tableHeader" },
      { text: "Calories", style: "tableHeader" },
      { text: "Carbs (g)", style: "tableHeader" },
      { text: "Fluids (L)", style: "tableHeader" },
      { text: "Sodium (mg)", style: "tableHeader" },
      { text: "Notes", style: "tableHeader" },
    ],
    ...results.hourly.map((h: any) => [
      h.hourIndex.toString(),
      h.calories.toString(),
      h.carbsGrams.toString(),
      h.fluidsL.toString(),
      h.sodiumMg.toString(),
      h.notes ?? "—",
    ]),
  ];

  // ---------- FINAL DOC DEFINITION ----------
  const docDefinition: any = {
    pageMargins: [40, 60, 40, 60],
    content: [
      // -------- Header Banner --------
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "ULTRA FUELING PLAN",
                style: "headerBanner",
              },
            ],
          ],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 20],
      },

      // -------- Summary Box --------
      {
        table: {
          widths: ["*", "*"],
          body: [
            [
              {
                stack: [
                  { text: "Distance", style: "summaryTitle" },
                  { text: `${results.distanceKm} km`, style: "summaryValue" },
                ],
              },
              {
                stack: [
                  { text: "Duration", style: "summaryTitle" },
                  {
                    text: `${results.durationHours} hours`,
                    style: "summaryValue",
                  },
                ],
              },
            ],
            [
              {
                stack: [
                  { text: "Terrain", style: "summaryTitle" },
                  { text: results.terrain, style: "summaryValue" },
                ],
              },
              {
                stack: [
                  { text: "Temperature", style: "summaryTitle" },
                  { text: `${results.temperatureC}°C`, style: "summaryValue" },
                ],
              },
            ],
          ],
        },
        layout: {
          fillColor: () => "#D8F3DC", // light hay green
        },
        margin: [0, 0, 0, 20],
      },

      // -------- Hourly Breakdown Title --------
      {
        text: "Hourly Breakdown",
        style: "sectionHeader",
        margin: [0, 0, 0, 10],
      },

      // -------- Hourly Table --------
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "*", "*", "*", "*"],
          body: hourlyRows,
        },
        layout: {
          fillColor: (rowIndex: number) =>
            rowIndex === 0 ? "#2D6A4F" : rowIndex % 2 === 0 ? "#F1FFF6" : null,
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
        margin: [0, 0, 0, 20],
      },

      // -------- AI Notes --------
      ...(aiPlan
        ? [
            {
              text: "AI Notes",
              style: "sectionHeader",
              margin: [0, 10, 0, 5],
            },
            { text: aiPlan, style: "aiNotes" },
          ]
        : []),
    ],

    // -------- Styles --------
    styles: {
      headerBanner: {
        fillColor: "#1B4332",
        color: "white",
        fontSize: 22,
        bold: true,
        alignment: "center",
        margin: [0, 10, 0, 10],
      },
      sectionHeader: {
        fontSize: 18,
        bold: true,
        color: "#1B4332",
      },
      summaryTitle: {
        fontSize: 10,
        bold: true,
        color: "#2D6A4F",
      },
      summaryValue: {
        fontSize: 14,
        color: "#1B4332",
        bold: true,
        margin: [0, 2, 0, 10],
      },
      tableHeader: {
        fontSize: 12,
        color: "white",
        bold: true,
        fillColor: "#1B4332",
      },
      aiNotes: {
        fontSize: 12,
        italics: true,
        color: "#2D6A4F",
      },
    },
  };

  // Create & download
  pdfMake
    .createPdf(docDefinition)
    .download(`ultra_plan_${results.distanceKm}km.pdf`);
};
