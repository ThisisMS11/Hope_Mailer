"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const session = useSession();

  // Simulated authentication check (replace with actual logic)

  const handleButtonClick = () => {
    if (session.data?.user) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to HopeMailer
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-400">
          Streamline your referrals, follow-ups, and employee communication
          effortlessly.
        </p>
        <Button
          className="bg-[#0d9488] text-white hover:bg-[#0a756d]"
          onClick={handleButtonClick}
        >
          {session.data?.user ? "Go to Dashboard" : "Authenticate Now"}
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0d9488]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-[#0d9488]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 17l-4-4m0 0l-4-4m4 4h12M4 12h12m0 0l-4-4m0 8l4-4"
                />
              </svg>
            </div>
            <CardTitle>Send Mails</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Draft and send follow-up emails to employees and referrals
              efficiently.
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0d9488]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-[#0d9488]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.403-4.086a1 1 0 00-.868-.614h-5.458m5.615-1a1 1 0 01.778 1.769l-2.456 2.457m0 0L9 17l-2.456-2.456a1 1 0 011.414-1.414L15 17z"
                />
              </svg>
            </div>
            <CardTitle>Track Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitor your follow-up history and manage responses effectively.
            </p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0d9488]/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-[#0d9488]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 8h12m-6 4h6m-6 4h6M6 20h6m6-16h.5a1.5 1.5 0 01.75 2.85L18 8H6L4.75 4.85A1.5 1.5 0 015.5 2.5H6m6 6H6M6 10H4.5a1.5 1.5 0 00-1.46 1.88L5 17m0-7.5h12"
                />
              </svg>
            </div>
            <CardTitle>Employee Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Collaborate with employees for enhanced productivity and
              communication.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
