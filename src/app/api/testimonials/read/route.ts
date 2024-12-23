// get all testimonial 

import { connectDb} from '../../../../dbconfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import Testimonial from '../../../../models/testimonial.model'; // Ensure this is the correct path to your model

connectDb();

// Logic to get all testimonials for auser  goes here

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: "Please provide user id" }, { status: 400 });
    }

    try {
        const testimonials = await Testimonial.find({ testimonialGivenTo: userId });

        return NextResponse.json({
            message: 'Testimonials fetched successfully',
            success: true,
            testimonials
        });
    } catch (error) {
        return NextResponse.json({
            message: 'Testimonials fetch failed',
            success: false,
            error: error.message
        }, { status: 500 });
    }
}