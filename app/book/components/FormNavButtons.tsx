// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useStepValidator } from "../context/useStepValidator";

// export default function FormNavButtons({
//   backHref,
//   nextHref,
//   nextLabel = "Continue",
//   isSubmitting = false,
//   stepId,
// }: {
//   backHref?: string;
//   nextHref?: string;
//   nextLabel?: string;
//   isSubmitting?: boolean;
//   stepId: string;
// }) {
//   const router = useRouter();
//   const { validate, getFirstMissingField } = useStepValidator(stepId);
//   const [error, setError] = useState<string | null>(null);

//   /* -------------------------------------
//       AUTO HIDE ERROR AFTER 3 SECONDS
//   --------------------------------------*/
//   useEffect(() => {
//     if (!error) return;

//     const timer = setTimeout(() => {
//       setError(null);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [error]);

//   /* -------------------------------------
//       NEXT CLICK HANDLER WITH VALIDATION
//   --------------------------------------*/
//   function handleNext() {
//     const ok = validate();

//     if (!ok) {
//       const missing = getFirstMissingField();
//       setError(
//         missing
//           ? `Please fill: ${missing}`
//           : "Please complete all required fields."
//       );
//       return;
//     }

//     router.push(nextHref!);
//   }

//   return (
//     <div className="mt-6">
//       {/* BUTTON ROW */}
//       <div className="flex items-center justify-between">
//         {/* BACK BUTTON */}
//         {backHref && (
//           <button
//             onClick={() => router.push(backHref)}
//             className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
//           >
//             ← Back
//           </button>
//         )}

//         <div className="flex-1" />

//         {/* NEXT BUTTON */}
//         {nextHref && (
//           <button
//             onClick={handleNext}
//             disabled={isSubmitting}
//             className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:brightness-105 disabled:opacity-50"
//           >
//             {nextLabel} →
//           </button>
//         )}
//       </div>

//       {/* ERROR MESSAGE */}
//       {error && (
//         <p className="text-red-500 text-sm mt-2 text-right transition-opacity duration-300">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }
