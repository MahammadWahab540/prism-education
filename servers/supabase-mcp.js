// servers/supabase-mcp.js
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import readline from "readline";

const requireEnv = (k) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
};


const supabase = createClient(
