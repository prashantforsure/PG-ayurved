import { useState } from "react";
import { loadScript } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpay = () => {
  const [loading, setLoading] = useState(false);

  const initializePayment = async (courseId: string) => {
    try {
      setLoading(true);

      // Load Razorpay script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        throw new Error("Razorpay SDK failed to load");
      }

      // Create order
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
        // Add credentials to ensure cookies are sent
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const { orderId, amount, currency, paymentId } = await response.json();

      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        throw new Error("Razorpay key not found");
      }

      // Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency,
        name: "Your Course Platform",
        description: "Course Purchase",
        order_id: orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                paymentId, // Add the paymentId from the initial order
              }),
              credentials: "include",
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }

            const data = await verifyResponse.json();

            if (data.success) {
              // Payment successful, redirect to course or show success message
              window.location.href = `/courses/${courseId}`;
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
            // Optionally redirect to an error page
            // window.location.href = `/payment-failed?courseId=${courseId}`;
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
        },
        theme: {
          color: "#F37254",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Payment failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { initializePayment, loading };
};