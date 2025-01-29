# Dorf - Water Consumption Tracker

## Overview

Dorf, which means "village" in German, is a mobile application I developed to help my village, Ait ElFarssi in Tinghir, Morocco, track water consumption for each household. The app generates invoices based on water usage, making it easier to manage our local water supply system. Given that we manage our own water supply, including digging wells and maintaining infrastructure, this app is a practical solution to ensure fair distribution and efficient management.

## Features

- **Water Consumption Tracking**: Easily track water usage for each household in the village.
- **Invoice Generation**: Automatically generate invoices based on water consumption.
- **Local Water Supply Management**: Tailored for villages like ours that manage their own water supply systems.
- **User-Friendly Interface**: Built with a focus on simplicity and ease of use for all villagers.

## Technology Stack

- **Frontend**: Built using React and TanStack Router for a seamless user experience.
- **Backend**: Powered by Cloudflare Workers and Hono, with Turso for database management.
- **Mobile**: Developed using Tauri for Android, ensuring a native feel.
- **Monorepo**: The project is structured as a monorepo, making it easier to manage and scale.

## Motivation

Living in Ait ElFarssi, I saw firsthand the challenges we face in managing our water supply. From digging wells to maintaining the infrastructure, it's a community effort. I wanted to create a tool that simplifies tracking water consumption and generating invoices, ensuring that everyone contributes fairly and our resources are managed efficiently.

## Getting Started

### Prerequisites

- Node.js
- Bun
- Tauri CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbdelilahOu/Dorf.git
   ```
2. Navigate to the project directory:
   ```bash
   cd dorf
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Start the development server:
   ```bash
   bun run dev
   ```

### Building the App

To build the app for Android, run:
```bash
bun run tauri build
```
