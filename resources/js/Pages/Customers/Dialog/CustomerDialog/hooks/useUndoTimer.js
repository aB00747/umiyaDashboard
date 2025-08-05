import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@/utils/notifications';

/**
 * Custom hook for managing undo functionality with timer
 * @param {number} duration - Timer duration in seconds (default: 5)
 * @returns {Object} Undo state and handlers
 */
export const useUndoTimer = (duration = 5) => {
    const [previousState, setPreviousState] = useState(null);
    const [showTimer, setShowTimer] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [timerId, setTimerId] = useState(null);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [timerId]);

    const startUndoTimer = useCallback((stateToSave) => {
        // Save current state for possible undo
        setPreviousState(stateToSave);
        
        // Show undo timer
        setShowTimer(true);
        setTimeLeft(duration);
        
        // Show info notification
        notifications.info(`Action completed. Undo available for ${duration} seconds.`);
        
        // Start countdown timer
        const newTimerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(newTimerId);
                    setShowTimer(false);
                    setPreviousState(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        setTimerId(newTimerId);
    }, [duration]);

    const executeUndo = useCallback(() => {
        const stateToRestore = previousState;
        
        // Clear timer and state
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
        setShowTimer(false);
        setPreviousState(null);
        
        if (stateToRestore) {
            notifications.success("Action undone successfully!");
            return stateToRestore;
        }
        return null;
    }, [previousState, timerId]);

    const cancelUndo = useCallback(() => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
        setShowTimer(false);
        setPreviousState(null);
    }, [timerId]);

    return {
        showTimer,
        timeLeft,
        startUndoTimer,
        executeUndo,
        cancelUndo,
        hasUndoState: Boolean(previousState),
    };
};