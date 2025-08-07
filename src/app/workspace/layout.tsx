"use client";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-auto bg-[#ffffff] h-full">
      <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
        {children}
      </div>
    </main>
  );
}
