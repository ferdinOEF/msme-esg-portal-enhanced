export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';import { recommend } from '@/lib/recommend'
export async function POST(req:NextRequest){const body=await req.json();const input={sector:body.sector,size:body.size,state:body.state,udyam:body.udyam,turnoverCr:body.turnoverCr?Number(body.turnoverCr):undefined,compliance:String(body.compliance||'').split(',').map((s:string)=>s.trim()).filter(Boolean)};return NextResponse.json(recommend(input))}
