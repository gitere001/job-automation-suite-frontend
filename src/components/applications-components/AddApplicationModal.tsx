import { useState } from "react";
import {
  XMarkIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import FeedbackModal from "./FeedbackModal";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FeedbackResult {
  success: boolean;
  message?: string;
  summary?: {
    totalCompanies: number;
    successfullySent: number;
    skipped: number;
    failed: number;
    processedAt: string;
  };
  detailedResults?: Array<{
    company: string;
    email: string;
    status: 'sent' | 'skipped' | 'failed' | 'error';
    reason?: string;
    error?: string;
    messageId?: string;
    timestamp: string;
  }>;
}

const AddApplicationModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddApplicationModalProps) => {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [singleForm, setSingleForm] = useState({
    name: "",
    email: "",
    website: "",
  });
  const [bulkInput, setBulkInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleForm.name.trim() || !singleForm.email.trim()) {
      setError("Please fill in both company name and email");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/job-applications/send-applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify([
            {
              name: singleForm.name.trim(),
              email: singleForm.email.trim(),
              website: singleForm.website.trim(),
            },
          ]),
        },
      );

      const data = await response.json();

      if (data.success) {
        setFeedbackResult(data);
        setShowFeedback(true);
        onSuccess();
        setSingleForm({ name: "", email: "", website: "" });
        // Don't close modal yet - show feedback first
      } else {
        setError(data.message || "Failed to add application");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async () => {
    if (!bulkInput.trim()) {
      setError("Please enter company data");
      return;
    }

    // Parse bulk input: "Company Name, email@company.com"
    const lines = bulkInput.split("\n").filter((line) => line.trim());
    const companies = [];

    for (const line of lines) {
      const parts = line.split(",").map((part) => part.trim());
      if (parts.length >= 2) {
        companies.push({
          name: parts[0],
          email: parts[1],
          website: parts[2] || "",
        });
      }
    }

    if (companies.length === 0) {
      setError("Please enter data in format: Company Name, email@company.com");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/job-applications/send-applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(companies),
        },
      );

      const data = await response.json();

      if (data.success) {
        setFeedbackResult(data);
        setShowFeedback(true);
        onSuccess();
        setBulkInput("");
        // Don't close modal yet - show feedback first
      } else {
        setError(data.message || "Failed to add applications");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkPaste = (text: string) => {
    // Try to auto-format if pasting just emails
    const lines = text.split("\n").filter((line) => line.trim());

    // If all lines look like emails (no commas), auto-add placeholder names
    if (lines.every((line) => !line.includes(",") && line.includes("@"))) {
      const formatted = lines
        .map((email) => {
          const domain = email.split("@")[1]?.split(".")[0] || "Company";
          const companyName = domain.charAt(0).toUpperCase() + domain.slice(1);
          return `${companyName}, ${email}`;
        })
        .join("\n");
      setBulkInput(formatted);
    } else {
      setBulkInput(text);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    setFeedbackResult(null);
    onClose(); // Close the main modal after feedback
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlusIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add Job Applications
                </h2>
                <p className="text-sm text-gray-600">
                  Add single or multiple companies at once
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`flex-1 py-3 text-sm font-medium ${activeTab === "single" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("single")}
              >
                Single Company
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${activeTab === "bulk" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setActiveTab("bulk")}
              >
                Bulk Add
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {activeTab === "single" ? (
              <form onSubmit={handleSingleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={singleForm.name}
                    onChange={(e) =>
                      setSingleForm({ ...singleForm, name: e.target.value })
                    }
                    placeholder="e.g., Google Inc."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={singleForm.email}
                    onChange={(e) =>
                      setSingleForm({ ...singleForm, email: e.target.value })
                    }
                    placeholder="e.g., careers@google.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                  </label>
                  <input
                    type="text"
                    value={singleForm.website}
                    onChange={(e) =>
                      setSingleForm({ ...singleForm, website: e.target.value })
                    }
                    placeholder="e.g., www.google.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Adding..." : "Add Application"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste Companies (One per line)
                  </label>
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pasted = e.clipboardData.getData("text");
                      handleBulkPaste(pasted);
                    }}
                    placeholder="Format: Company Name, email@company.com, website.com
Example:
Google, careers@google.com, www.google.com
Microsoft, jobs@microsoft.com, www.microsoft.com
Amazon, recruiting@amazon.com, www.amazon.com"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Format Tips:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• One company per line</li>
                    <li>
                      • Format:{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        Company Name, email@company.com
                      </code>
                    </li>
                    <li>
                      • You can paste just emails - names will be auto-generated
                    </li>
                    <li>
                      • Example:{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        Google, careers@google.com
                      </code>
                    </li>
                  </ul>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleBulkSubmit}
                    disabled={isSubmitting || !bulkInput.trim()}
                    className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting
                      ? "Adding..."
                      : `Add ${bulkInput.split("\n").filter((l) => l.trim()).length} Companies`}
                  </button>
                  <button
                    onClick={() => setBulkInput("")}
                    disabled={isSubmitting}
                    className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Applications will be sent immediately to the provided email
              addresses. Each email is sent with a 5-second delay between them.
            </p>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={handleFeedbackClose}
        result={feedbackResult}
      />
    </>
  );
};

export default AddApplicationModal;