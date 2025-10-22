export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            DataCleanerPro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Clean and normalize messy spreadsheet data with intelligent automation
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            DataCleanerPro is currently in development. Features include:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Smart duplicate detection and removal</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Date and phone number normalization</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>AI-powered job title and company name standardization</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Google Sheets integration</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Privacy-first: auto-delete files, PII redaction</span>
            </li>
          </ul>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Status: Week 1 - Foundations in progress
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
