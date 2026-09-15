import { jsPDF } from "jspdf";
import { BirthdayPlan, UserProfile } from "../types";

export function generateBornDayPdf(plan: BirthdayPlan, profile: UserProfile): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter", // 612 x 792 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  const honoree = plan.birthdayOverview.celebrantName || profile.fullName || "Birthday VIP";
  const honoreeLabel =
    profile.honoreeRole === "boy"
      ? "Birthday Boy"
      : profile.honoreeRole === "girl"
      ? "Birthday Girl"
      : "Birthday Boy or Birthday Girl";

  const addHeader = () => {
    // Top Brand Banner
    doc.setFillColor(9, 9, 9);
    doc.rect(0, 0, pageWidth, 54, "F");

    // Banner Accent Stripe (Sunny Yellow & Peach Coral)
    doc.setFillColor(250, 240, 130);
    doc.rect(0, 50, pageWidth, 4, "F");

    doc.setTextColor(250, 240, 130);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("BORN DAY", margin, 32);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("OFFICIAL CELEBRATION MASTERPLAN", margin + 95, 32);

    doc.setFontSize(9);
    doc.setTextColor(231, 224, 209);
    doc.text("VERIFIED ITINERARY & LOCAL GUIDE", pageWidth - margin - 180, 32);

    currentY = 75;
  };

  const checkPageOverflow = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - margin - 30) {
      // Add footer to current page
      addFooter();
      doc.addPage();
      addHeader();
    }
  };

  const addFooter = () => {
    doc.setDrawColor(231, 224, 209);
    doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(92, 88, 79);
    doc.text(
      `Born Day Co-Planner • Curated for ${honoree} • Generated ${new Date().toLocaleDateString()}`,
      margin,
      pageHeight - 20
    );
    doc.text(
      "Confirm availability and reservations prior to celebration.",
      pageWidth - margin - 220,
      pageHeight - 20
    );
  };

  // 1. Initial Page Header
  addHeader();

  // 2. VIP Title Card Box
  doc.setFillColor(252, 247, 229);
  doc.setDrawColor(9, 9, 9);
  doc.setLineWidth(1.5);
  doc.roundedRect(margin, currentY, contentWidth, 76, 8, 8, "FD");

  doc.setTextColor(9, 9, 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(`${honoree}’s Birthday Plan`, margin + 16, currentY + 28);

  doc.setFontSize(10);
  doc.setTextColor(27, 59, 43);
  doc.text(
    `Role: ${honoreeLabel}   •   Age: ${plan.birthdayOverview.ageTurning} Years Young   •   Date: ${plan.birthdayOverview.celebrationDate}   •   Location: ${profile.location}`,
    margin + 16,
    currentY + 48
  );

  doc.setFontSize(9);
  doc.setTextColor(92, 88, 79);
  doc.text(
    `Vibe: ${plan.themeAndMood.mood}   •   Format: ${plan.eventFormatAndVenue.format}`,
    margin + 16,
    currentY + 64
  );

  currentY += 92;

  // 3. Overview Narrative
  checkPageOverflow(50);
  doc.setFillColor(245, 243, 237);
  doc.roundedRect(margin, currentY, contentWidth, 42, 6, 6, "F");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(9, 9, 9);
  const splitOverview = doc.splitTextToSize(plan.birthdayOverview.summary, contentWidth - 24);
  doc.text(splitOverview, margin + 12, currentY + 16);
  currentY += 54;

  // 4. Celebration Timeline Section
  checkPageOverflow(70);
  doc.setFillColor(9, 9, 9);
  doc.roundedRect(margin, currentY, contentWidth, 24, 4, 4, "F");
  doc.setTextColor(250, 240, 130);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CHRONOLOGICAL TIMELINE & RUN OF SHOW", margin + 12, currentY + 16);
  currentY += 32;

  plan.timeline.forEach((event, idx) => {
    checkPageOverflow(44);

    // Event container
    doc.setFillColor(idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 246);
    doc.setDrawColor(231, 224, 209);
    doc.setLineWidth(0.75);
    doc.roundedRect(margin, currentY, contentWidth, 38, 4, 4, "FD");

    // Time pill
    doc.setFillColor(250, 240, 130);
    doc.roundedRect(margin + 8, currentY + 8, 62, 18, 3, 3, "F");
    doc.setTextColor(9, 9, 9);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(event.time, margin + 14, currentY + 20);

    // Title & location
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(9, 9, 9);
    doc.text(event.title, margin + 78, currentY + 16);

    if (event.locationNote) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(92, 88, 79);
      doc.text(`@ ${event.locationNote}`, margin + 78, currentY + 28);
    }

    // Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(92, 88, 79);
    const desc = event.description.length > 75 ? event.description.substring(0, 72) + "..." : event.description;
    doc.text(desc, margin + 240, currentY + 20);

    currentY += 44;
  });

  currentY += 10;

  // 5. Curated Dining Recommendations (Ranked Highest Rated First)
  checkPageOverflow(80);
  doc.setFillColor(27, 59, 43);
  doc.roundedRect(margin, currentY, contentWidth, 24, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CURATED DINING & RESTAURANTS (HIGHEST RATED ONLINE)", margin + 12, currentY + 16);
  currentY += 32;

  plan.foodAndCake.sampleFoodOptions.forEach((food) => {
    checkPageOverflow(56);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(231, 224, 209);
    doc.setLineWidth(0.75);
    doc.roundedRect(margin, currentY, contentWidth, 52, 6, 6, "FD");

    // Restaurant Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(9, 9, 9);
    doc.text(food.name, margin + 12, currentY + 16);

    // Rating & Acclaim Badge
    const ratingStr = `${food.rating ? food.rating.toFixed(1) + "★" : "4.9★"} ${food.reviewCount || "Top-Rated"}`;
    doc.setFillColor(9, 9, 9);
    doc.roundedRect(margin + 200, currentY + 6, 95, 14, 3, 3, "F");
    doc.setTextColor(250, 240, 130);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(ratingStr, margin + 206, currentY + 16);

    // Cost estimate
    doc.setTextColor(27, 59, 43);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.text(`Est: ${food.costEstimatePerPerson}`, margin + 305, currentY + 16);

    // Cuisine & Atmosphere
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(92, 88, 79);
    doc.text(`${food.cuisine}  •  ${food.atmosphere}`, margin + 12, currentY + 30);

    // Dietary Note & Fit
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(27, 59, 43);
    const fitNote = `Match: ${food.whyItFits} ${food.dietaryNotes ? `(Dietary: ${food.dietaryNotes})` : ""}`;
    const truncatedFit = fitNote.length > 115 ? fitNote.substring(0, 112) + "..." : fitNote;
    doc.text(truncatedFit, margin + 12, currentY + 44);

    currentY += 58;
  });

  currentY += 10;

  // 6. Three-Tier Budget Breakdown
  checkPageOverflow(90);
  doc.setFillColor(9, 9, 9);
  doc.roundedRect(margin, currentY, contentWidth, 24, 4, 4, "F");
  doc.setTextColor(250, 240, 130);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("REALISTIC THREE-TIER BUDGET ARCHITECTURE", margin + 12, currentY + 16);
  currentY += 32;

  const tiers = [
    { label: "Tier 1: Up to $100/person", data: plan.threeTierBudget.budget },
    { label: "Tier 2: $100 - $300/person", data: plan.threeTierBudget.moderate },
    { label: "Tier 3: $300+/person", data: plan.threeTierBudget.splurge },
  ];

  tiers.forEach((t) => {
    checkPageOverflow(44);
    doc.setFillColor(252, 247, 229);
    doc.setDrawColor(9, 9, 9);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, contentWidth, 38, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(9, 9, 9);
    doc.text(`${t.label}  —  ${t.data.title}`, margin + 12, currentY + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(92, 88, 79);
    doc.text(`Total: ${t.data.totalRangeUsd}  •  Per Person: ${t.data.perPersonRangeUsd}`, margin + 12, currentY + 28);

    doc.text(t.data.description.length > 75 ? t.data.description.substring(0, 72) + "..." : t.data.description, margin + 240, currentY + 28);
    currentY += 44;
  });

  currentY += 10;

  // 7. Dietary & Personalization Notes
  if (profile.dietaryRestrictions?.length || profile.dietaryNotes) {
    checkPageOverflow(50);
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1);
    doc.roundedRect(margin, currentY, contentWidth, 36, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14);
    doc.text("CONFIRMED DIETARY DIRECTIVES & CRAVINGS:", margin + 10, currentY + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const dietInfo = `${profile.dietaryRestrictions?.join(", ") || "None"} ${profile.dietaryNotes ? `• Notes: "${profile.dietaryNotes}"` : ""}`;
    doc.text(dietInfo.length > 95 ? dietInfo.substring(0, 92) + "..." : dietInfo, margin + 10, currentY + 26);
    currentY += 44;
  }

  // 8. Add footer to the last page
  addFooter();

  // Save the PDF file
  const sanitizedName = (honoree || "BornDay").replace(/[^a-zA-Z0-9]/g, "-");
  doc.save(`${sanitizedName}-Born-Day-Celebration-Plan.pdf`);
}
