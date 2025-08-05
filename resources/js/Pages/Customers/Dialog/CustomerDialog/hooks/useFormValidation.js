
import { useState, useCallback, useEffect } from 'react';

/**
 * useFormValidation
 *
 * Hook to handle form validation using a given schema and optional custom
 * validations.
 *
 * @param {Object} schema - The validation schema, where each key is a field name
 *   and each value is an object with a `rules` property that is an array of
 *   validation functions. Each function takes the field value and label as
 *   arguments and returns an error message if the field is invalid.
 * @param {Array<Function>} customValidations - An array of custom validation
 *   functions that take the entire form data as an argument and return an object
 *   with field names as keys and error messages as values.
 *
 * @returns An object with the following properties:
 *   - `errors`: An object with field names as keys and error messages as values.
 *   - `touched`: An object with field names as keys and booleans as values
 *     indicating whether each field has been touched.
 *   - `isValid`: A boolean indicating whether the form is valid.
 *   - `validateSingleField`: A function to validate a single field, taking the
 *     field name, value, and entire form data as arguments.
 *   - `validateAllFields`: A function to validate all fields, taking the entire
 *     form data as an argument.
 *   - `markFieldTouched`: A function to mark a field as touched, taking the
 *     field name as an argument.
 *   - `clearFieldError`: A function to clear an error for a single field, taking
 *     the field name as an argument.
 *   - `clearAllErrors`: A function to clear all errors.
 *   - `getFieldError`: A function to get the error for a single field, taking the
 *     field name as an argument.
 *   - `hasFieldError`: A function to check if a single field has an error, taking
 *     the field name as an argument.
 */
export const useFormValidation = (schema, customValidations = []) => {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValid, setIsValid] = useState(false);

    const validateField = useCallback((fieldName, value, allData = {}) => {
        const fieldSchema = schema[fieldName];
        if (!fieldSchema) return null;

        for (const rule of fieldSchema.rules) {
            const error = rule(value, fieldSchema.label);
            if (error) return error;
        }
        return null;
    }, [schema]);

    const validateForm = useCallback((data) => {
        const newErrors = {};

        // Validate individual fields
        Object.keys(schema).forEach(fieldName => {
            const error = validateField(fieldName, data[fieldName], data);
            if (error) {
                newErrors[fieldName] = error;
            }
        });

        // Run custom validations
        customValidations.forEach(validator => {
            const customErrors = validator(data);
            // Object.assign(newErrors, customErrors);

            Object.keys(customErrors).forEach(fieldName => {
            if (customErrors[fieldName]) {
                newErrors[fieldName] = customErrors[fieldName];
            }
        });
        });

        return newErrors;
    }, [schema, customValidations, validateField]);

    const clearFieldError = useCallback((fieldName) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    const validateSingleField = useCallback((fieldName, value, allData = {}) => {
        const fieldError = validateField(fieldName, value, allData);

        if (!fieldError) {
            clearFieldError(fieldName);
            return null;
        }

        setErrors(prev => ({
            ...prev,
            [fieldName]: fieldError
        }));

        return fieldError;
    }, [validateField, clearFieldError]);

    const validateAllFields = useCallback((data) => {
        console.log("data", data);
        const newErrors = validateForm(data);
        setErrors(newErrors);


        console.log("newErrors", newErrors);
        return newErrors;
    }, [validateForm]);

    const markFieldTouched = useCallback((fieldName) => {
        setTouched(prev => ({
            ...prev,
            [fieldName]: true
        }));
    }, []);

    const clearAllErrors = useCallback(() => {
        setErrors({});
        setTouched({});
    }, []);

    // Check if form is valid
    useEffect(() => {
        setIsValid(Object.keys(errors).length === 0);
    }, [errors]);

    const getFieldError = useCallback((fieldName) => {
        return touched[fieldName] ? errors[fieldName] || null : null;
    }, [errors, touched]);

    const hasFieldError = useCallback((fieldName) => {
        return touched[fieldName] && !!errors[fieldName];
    }, [errors, touched]);

    return {
        errors,
        touched,
        isValid,
        validateSingleField,
        validateAllFields,
        markFieldTouched,
        clearFieldError,
        clearAllErrors,
        getFieldError,
        hasFieldError
    };
};
