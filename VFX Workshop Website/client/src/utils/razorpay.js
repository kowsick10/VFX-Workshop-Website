/**
 * Razorpay Checkout Utility
 * Loads checkout.js lazily and opens the secure popup.
 */

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({
  orderData,
  formData,
  onSuccess,
  onDismiss,
  onError,
}) {
  const { orderId, amountPaise, keyId, isDemoMode, registrationId, courseTitle } = orderData;

  if (isDemoMode) {
    // Handled by the sandbox UI in RegistrationForm; nothing to open.
    return null;
  }

  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onError?.(
      "Unable to connect to Razorpay Checkout. Please check your internet connection or disable ad-blockers."
    );
    return null;
  }

  const options = {
    key: keyId,
    amount: amountPaise,
    currency: "INR",
    name: "i5 VFX Studio",
    description: `Registration for ${courseTitle}`,
    image: "https://www.i5vfxstudio.com/assets/i5logo-lTIxL0TM.png",
    order_id: orderId,
    handler: async function (response) {
      try {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          onSuccess?.(verifyData.registration);
        } else {
          onError?.(verifyData.error || "Payment signature verification failed.");
        }
      } catch {
        onError?.(
          "Payment succeeded, but server confirmation hit a network error. Please contact studio support with Payment ID: " +
            response.razorpay_payment_id
        );
      }
    },
    prefill: {
      name: formData.parentName || formData.studentName,
      email: formData.parentEmail,
      contact: formData.parentMobile,
    },
    notes: {
      student_name: formData.studentName,
      student_grade: formData.grade,
      school_name: formData.schoolName,
      registration_id: registrationId,
    },
    theme: {
      color: "#e01e26",
      backdrop_color: "rgba(10, 10, 12, 0.85)",
    },
    modal: {
      ondismiss: function () {
        fetch("/api/payment-cancelled", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId,
            reason: "User closed checkout modal",
          }),
        }).catch(() => {});
        onDismiss?.();
      },
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      fetch("/api/payment-cancelled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId,
          reason: response.error?.description || "Payment failed",
        }),
      }).catch(() => {});
      onError?.(
        response.error?.description ||
          "Payment was declined or failed. Your registration is saved — you can retry with a different method."
      );
    });
    rzp.open();
    return rzp;
  } catch (error) {
    onError?.(error.message || "Failed to initialize Razorpay checkout.");
    return null;
  }
}
