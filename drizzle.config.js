/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./utils/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://ai-interview-mocker_owner:kcqRzV6uly1e@ep-autumn-dust-a16tmp0x.ap-southeast-1.aws.neon.tech/ai-interview-mocker?sslmode=require",
  },
};
