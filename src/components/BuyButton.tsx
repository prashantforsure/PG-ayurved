import { useRazorpay } from "@/hooks/useRazorpay";

export const BuyButton = ({ courseId }: { courseId: string }) => {
  const { initializePayment, loading } = useRazorpay();

  return (
    <button
      onClick={() => initializePayment(courseId)}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
    >
      {loading ? "Processing..." : "Buy Now"}
    </button>
  );
};