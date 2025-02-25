import React, { Suspense } from "react";

const NotFoundPage = () => {
  // Your logic using useSearchParams() here
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      {/* Other content */}
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundPage />
    </Suspense>
  );
}
