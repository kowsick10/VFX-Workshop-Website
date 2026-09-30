/**
 * Microsoft Form / Power Automate Webhook Integration
 * 
 * When a registration is successfully paid and verified, this module
 * sends the registration data to a Microsoft Form / Power Automate HTTP trigger,
 * syncing it directly to an Excel Sheet, SharePoint list, or MS Teams notification.
 */

export async function forwardToMicrosoftForm(registration) {
  const webhookUrl = process.env.MICROSOFT_FORM_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.includes("YOUR_WEBHOOK_URL_HERE")) {
    console.log("[MS Form Integration] No active webhook URL configured. Skipping forward.");
    return { success: false, reason: "NOT_CONFIGURED" };
  }

  const payload = {
    registrationId: registration.id,
    registeredAt: registration.createdAt,
    paymentStatus: registration.status,
    amountPaid: registration.amount,
    currency: "INR",
    razorpayPaymentId: registration.razorpayPaymentId || "N/A",
    student: {
      fullName: registration.studentName,
      email: registration.studentEmail || "N/A",
      mobile: registration.studentMobile,
      grade: registration.grade,
      schoolName: registration.schoolName,
      schoolBoard: registration.schoolBoard,
    },
    parent: {
      fullName: registration.parentName,
      mobile: registration.parentMobile,
      email: registration.parentEmail,
      relationship: registration.relationship,
    },
    course: {
      id: registration.courseId,
      title: registration.courseTitle,
      learningFormat: registration.learningFormat,
      schedule: registration.preferredSchedule,
      startDate: registration.preferredStartDate || "Flexible / Studio Notice",
    },
    additional: {
      experience: registration.previousExperience,
      questions: registration.additionalQuestions || "None",
      marketingConsent: registration.marketingConsent ? "Yes" : "No",
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`[MS Form Integration] Successfully forwarded registration ${registration.id}`);
      return { success: true };
    } else {
      console.warn(`[MS Form Integration] Failed to forward to MS Form webhook: ${response.status} ${response.statusText}`);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.error(`[MS Form Integration] Error connecting to MS Form webhook:`, error.message);
    return { success: false, error: error.message };
  }
}
