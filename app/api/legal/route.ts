export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';import { prisma } from '@/lib/db'
function ok(req:NextRequest){const key=req.headers.get('x-admin-key')||'';return !!key&&!!process.env.ADMIN_KEY&&key===process.env.ADMIN_KEY}
export async function POST(req:NextRequest){if(!ok(req))return new NextResponse('Unauthorized',{status:401});const body=await req.json();const tags=String(body.tags||'').split(',').map((s:string)=>s.trim()).filter(Boolean);const item=await prisma.legalDoc.create({data:{title:body.title,jurisdiction:body.jurisdiction||'Central',sector:body.sector||null,locationTag:body.locationTag||null,summary:body.summary||'',url:body.url||null,tags}});return NextResponse.json(item)}
