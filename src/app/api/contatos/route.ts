import { Contato } from "@/core/contato";
import { NextResponse } from "next/server";

let contatos: Contato[] = [];

export async function GET() {
  return NextResponse.json(contatos, { status: 200 });
}

export async function POST(request: Request) {
  const contato: Contato = await request.json();
  contato.id = Date.now().toString();
  contatos.push(contato);
  return NextResponse.json(contato, { status: 201 });
}

export async function PUT(request: Request) {
  const contato: Contato = await request.json();
  contatos = contatos.map(c => (c.id === contato.id ? contato : c));
  return NextResponse.json(contato, { status: 200 });
}

export async function DELETE(request: Request) {
  const contato: Contato = await request.json();
  contatos = contatos.filter(c => c.id !== contato.id);
  return NextResponse.json(null, { status: 204 });
}
