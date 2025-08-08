"use client";

import React, { useState } from "react";
import { SessionJoinModal } from "./session-join-modal";
import { Button } from "./button";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SessionJoinButtonProps {
  sessionId?: string;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
  onJoinAsPresenter?: (method: string, sessionId?: string) => void;
  onJoinAsAttendee?: (method: string, sessionId?: string) => void;
}

export function SessionJoinButton({
  sessionId,
  variant = "default",
  size = "default",
  className,
  children,
  onJoinAsPresenter,
  onJoinAsAttendee,
}: SessionJoinButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleJoinAsPresenter = (method: string) => {
    onJoinAsPresenter?.(method, sessionId);
    setIsModalOpen(false);
  };

  const handleJoinAsAttendee = (method: string) => {
    onJoinAsAttendee?.(method, sessionId);
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={cn("flex items-center gap-2", className)}
      >
        <Users className="w-4 h-4" />
        {children || "Join Session"}
      </Button>

      <SessionJoinModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        sessionId={sessionId}
        onJoinAsPresenter={handleJoinAsPresenter}
        onJoinAsAttendee={handleJoinAsAttendee}
      />
    </>
  );
}

// Export a hook for programmatic control
export function useSessionJoinModal(sessionId?: string) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const Modal = ({
    onJoinAsPresenter,
    onJoinAsAttendee,
  }: {
    onJoinAsPresenter?: (method: string, sessionId?: string) => void;
    onJoinAsAttendee?: (method: string, sessionId?: string) => void;
  }) => (
    <SessionJoinModal
      open={isOpen}
      onOpenChange={setIsOpen}
      sessionId={sessionId}
      onJoinAsPresenter={(method) => {
        onJoinAsPresenter?.(method, sessionId);
        closeModal();
      }}
      onJoinAsAttendee={(method) => {
        onJoinAsAttendee?.(method, sessionId);
        closeModal();
      }}
    />
  );

  return {
    isOpen,
    openModal,
    closeModal,
    Modal,
  };
}
