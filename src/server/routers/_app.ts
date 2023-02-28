import { TRPCError } from "@trpc/server";
import { Base64 } from "js-base64";
import { z } from "zod";
import { procedure, router } from "../trpc";

export interface CreatePredictionResponse {
  uuid: string;
  version_id: string;
  created_at: string;
  updated_at: string;
  completed_at: any;
  status: string;
  inputs: any;
  output: any;
  output_files: any[];
  error: any;
  run_logs: string;
  version: any;
  user: any;
}

export interface GetPredictionResponse {
  uuid: string;
  version_id: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
  status: string;
  inputs: any;
  output: Output;
  output_files: any[];
  error: any;
  run_logs: string;
  version: any;
  user: any;
}

export interface Output {
  segments: any[];
  translation: any;
  transcription: string;
  detected_language: string;
}

const ExpectedCreatePredictionResponseSchema = z.object({
  uuid: z.string(),
  status: z.string(),
});

const ExpectedGetPredictionResponseSchema = z.object({
  uuid: z.string(),
  status: z.string(),
  output: z.object({
    transcription: z.string(),
  }),
});

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
  predictions: router({
    create: procedure
      .input(
        z.object({
          audio: z.string().refine(Base64.isValid),
        })
      )
      .mutation(async ({ input }) => {
        const base64Audio = input.audio;
        const response = await fetch(
          "https://api.replicate.com/v1/predictions",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Pinned to a specific version of Whisper
              // See https://replicate.com/openai/whisper/versions
              version:
                "30414ee7c4fffc37e260fcab7842b5be470b9b840f2b608f5baa9bbef9a259ed",

              input: { audio: base64Audio },
            }),
          }
        );

        if (response.status !== 201) {
          let error = await response.json();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error.detail,
          });
        }

        const data = await response.json();
        const predictionCreated =
          ExpectedCreatePredictionResponseSchema.parse(data);
        return predictionCreated;
      }),
    get: procedure
      .input(
        z.object({
          uuid: z.string(),
        })
      )
      .query(async ({ input }) => {
        const { uuid } = input;
        const response = await fetch(
          "https://api.replicate.com/v1/predictions/" + uuid,
          {
            headers: {
              Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status !== 201) {
          let error = await response.json();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: error.detail,
          });
        }

        const data = await response.json();
        const prediction = ExpectedGetPredictionResponseSchema.parse(data);
        return prediction;
      }),
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
