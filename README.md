AI Website build built By Joane
1. Purpose
The purpose of this project is to empower small business owners (barbers, salon owners, consultants, etc.) who lack technical skills to launch a professional, high-converting website in minutes. It removes the "fear of technology" by replacing complex design tools with a simple, question-based wizard that handles all the heavy lifting of layout, styling, and lead-capture integration.
2. High-Level Scope
The project encompasses a full-stack experience (currently focused on the frontend with mock/local persistence) that includes:
A Guided Onboarding Wizard: A 6-step flow to collect business identity, services, and design preferences.
Dynamic Site Engine: A system that generates a multi-section website in real-time based on user inputs.
Business Dashboard (Mini-CRM): A central hub for owners to manage their business data, view incoming leads, and track appointments.
Google Ecosystem Integration: Built-in support for connecting to Google Sheets as a database for leads and appointments.
3. Functional Requirements
A. Website Builder (The Wizard)
Business Profiling: Users can select from predefined business types (Barbershop, Restaurant, etc.) or define a custom one.
Service Management: Users can add, edit, or remove services with specific pricing and descriptions.
Feature Toggling: Users can enable/disable specific website modules like Online Booking, Photo Galleries, or Customer Reviews.
Brand Customization: Users can choose from multiple design styles (Modern, Luxury, Bold) and pick a custom brand color with real-time hex validation.
Live Preview: A responsive preview mode that allows users to test their site on Desktop, Tablet, and Mobile frames before "publishing."
B. Business Dashboard
Lead Management: Display a list of recent leads captured from the website contact form.
Analytics Overview: High-level stats showing total leads, upcoming appointments, and total client count.
Settings Hub: Ability to update business information (phone, email, tagline) and manage the Google Sheets connection.
C. Lead Capture & CRM
Contact Forms: Automatically generated contact and booking forms that sync data to an external source.
Google Sheets Integration: A dedicated setup flow to connect the site to a Google Sheet via an Apps Script deployment.
4. Non-Functional Requirements
Usability (Beginner-Friendly): The UI must use "fear-free" language (e.g., "If you can answer questions, you can build your website") and provide tactile feedback through animations.
Performance: Smooth transitions between wizard steps using motion (Framer Motion) and fast rendering of the preview site.
Responsiveness: The generated website and the builder itself must be fully functional on mobile, tablet, and desktop devices.
Visual Consistency: Adherence to a modern, professional aesthetic using Tailwind CSS v4, with a primary focus on the user's chosen brand color.
Maintainability: A clean, component-based architecture using TypeScript to ensure the project can scale (e.g., adding a real backend or more design templates).
