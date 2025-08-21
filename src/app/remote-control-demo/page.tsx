"use client";

import { SessionControlCenter } from "@/components/ui/session-control-center";

export default function RemoteControlDemo() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wordly Remote Control Center
          </h1>
          <p className="text-gray-600">
            Remotely control multiple Wordly sessions from a single interface.
            Perfect for AV techs managing conference rooms, town halls, and
            events.
          </p>
        </div>

        {/* Use Case Example */}
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            🏛️ Town Hall Use Case
          </h2>
          <p className="text-blue-800 mb-4">
            A local government has set up a podium with a Wordly Present session
            for Public Comment. The AV tech can remotely control the session
            from the back room, changing languages as speakers approach the
            podium.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <strong className="text-blue-900">Speaker 1:</strong> English →
              Spanish
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <strong className="text-blue-900">Speaker 2:</strong> Spanish →
              Korean
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200">
              <strong className="text-blue-900">Emergency:</strong> Mute all
              inputs
            </div>
          </div>
        </div>

        {/* Control Interface */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Active Sessions
          </h2>

          <SessionControlCenter />
        </div>

        {/* Features List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🎛️ Control Features
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Remote language switching</li>
              <li>• Mute/unmute individual inputs</li>
              <li>• Pause/resume sessions</li>
              <li>• End sessions remotely</li>
              <li>• Listen to floor audio</li>
              <li>• Multiple session management</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔗 Supported Input Types
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Present App (podium/conference mic)</li>
              <li>• RTMPS Streams</li>
              <li>• Meeting Bots (Teams, Zoom, etc.)</li>
              <li>• Mobile App connections</li>
              <li>• Multiple concurrent inputs</li>
              <li>• Cross-platform compatibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
