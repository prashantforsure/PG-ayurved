export default function ErrorPage() {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Authentication Error</h1>
          <p>An error occurred during authentication. Please try again.</p>
        </div>
      </div>
    );
  }