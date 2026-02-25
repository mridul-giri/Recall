import { z } from "zod";

export const startSchema = z.object({
  telegramId: z.string({ required_error: "telegramId is required" }),
  userName: z.string().optional(),
  token: z.string().nullable().optional(),
});

export const telegramConnectSchema = z.object({
  telegramId: z.string({ required_error: "telegramId is required" }),
});

export const linkSchema = z.object({
  telegramId: z.string({ required_error: "telegramId is required" }),
  entities: z.array(z.any()).min(1, "entities cannot be empty"),
  text: z
    .string({ required_error: "text is required" })
    .min(1, "text cannot be empty"),
});

export const imageHeadersSchema = z.object({
  providerId: z.string({ required_error: "x-telegram-id header is required" }),
  extension: z.string({ required_error: "x-extension header is required" }),
  fileSize: z.string({ required_error: "x-file-size header is required" }),
  width: z.string({ required_error: "x-width header is required" }),
  height: z.string({ required_error: "x-height header is required" }),
});

export const videoHeadersSchema = z.object({
  providerId: z.string({ required_error: "x-telegram-id header is required" }),
  extension: z.string({ required_error: "x-extension header is required" }),
  fileSize: z.string({ required_error: "x-file-size header is required" }),
  mimeType: z.string({ required_error: "x-mime-type header is required" }),
});

export const documentHeadersSchema = z.object({
  providerId: z.string({ required_error: "x-telegram-id header is required" }),
  extension: z.string({ required_error: "x-extension header is required" }),
  fileSize: z.string({ required_error: "x-file-size header is required" }),
  mimeType: z.string({ required_error: "x-mime-type header is required" }),
  fileName: z.string({ required_error: "x-file-name header is required" }),
});

export const createTagSchema = z.object({
  tagName: z
    .string({ required_error: "tagName is required" })
    .min(1, "tagName cannot be empty")
    .max(50, "tagName must be 50 characters or less"),
});

export const updateTagSchema = createTagSchema;

export const attachContentsSchema = z.object({
  contentIds: z
    .array(z.string({ required_error: "Each contentId must be a string" }), {
      required_error: "contentIds is required",
    })
    .min(1, "contentIds cannot be empty"),
});

const contentTypeEnum = z.enum(["link", "image", "video", "document"]);

export const tagContentQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(30).default(20),
  type: contentTypeEnum.optional(),
});

export const contentQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  contentType: contentTypeEnum.optional(),
});

export const updateContentSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .min(1, "Title cannot be empty")
    .max(50),
});
