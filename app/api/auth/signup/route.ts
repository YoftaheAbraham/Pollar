import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface SignupData {
    name: string;
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await signupHandler(body);

        if (!result.success) {
            return NextResponse.json(result, { status: result.status || 400 });
        }

        return NextResponse.json({ 
            success: true, 
            data: result.data,
            message: "Account created successfully"
        });
    } catch (error: any) {
        return NextResponse.json(
            { 
                success: false, 
                message: "An unexpected error occurred",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

const signupHandler = async (data: any) => {
    // Validation
    const errors: Record<string, string> = {};

    if (!data.name || typeof data.name !== 'string') {
        errors.name = "Please enter your name";
    } else if (data.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
    }

    if (!data.email || typeof data.email !== 'string') {
        errors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Please enter a valid email address";
    }

    if (!data.password || typeof data.password !== 'string') {
        errors.password = "Please enter a password";
    } else if (data.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) {
        return { 
            success: false, 
            errors,
            message: "Validation failed",
            status: 400
        };
    }

    const cleanData: SignupData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password
    };

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: cleanData.email }
    });

    if (existingUser) {
        return {
            success: false,
            message: "An account with this email already exists",
            status: 409
        };
    }

    try {
        const password = await hashPassword(cleanData.password);
        const user = await prisma.user.create({
            data: {
                name: cleanData.name,
                email: cleanData.email,
                password
            },
            select: {
                email: true,
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        });

        const token = await generateToken({
            email: user.email,
            id: user.id
        });

        return {
            success: true,
            data: { ...user, token },
            message: "Account created successfully"
        };

    } catch (error: any) {
        console.error("Signup error:", error);
        return {
            success: false,
            message: "Failed to create account",
            status: 500
        };
    }
};

const generateToken = async (payload: { email: string; id: string }) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};