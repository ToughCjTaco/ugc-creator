import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const actorsDir = path.join(process.cwd(), "assets", "actors");
    
    if (!fs.existsSync(actorsDir)) {
      return NextResponse.json([], { status: 200 });
    }

    const files = fs.readdirSync(actorsDir).filter((f) => f.endsWith(".json"));
    const actors = files.map((file) => {
      const filePath = path.join(actorsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    });

    return NextResponse.json(actors, { status: 200 });
  } catch (error) {
    console.error("Error fetching actors:", error);
    return NextResponse.json(
      { error: "Failed to fetch actors" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const actor = await request.json();
    const actorsDir = path.join(process.cwd(), "assets", "actors");

    if (!fs.existsSync(actorsDir)) {
      fs.mkdirSync(actorsDir, { recursive: true });
    }

    const fileName = `${actor.id}.json`;
    const filePath = path.join(actorsDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(actor, null, 2));

    return NextResponse.json(actor, { status: 201 });
  } catch (error) {
    console.error("Error creating actor:", error);
    return NextResponse.json(
      { error: "Failed to create actor" },
      { status: 500 }
    );
  }
}
