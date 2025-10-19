import * as Joi from 'joi';

export interface EnvironmentConfig {
  // Server Configuration
  NODE_ENV: string;
  PORT: number;

  // Database Configuration
  DATABASE_URL: string;

  // JWT Configuration
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // Redis Configuration
  REDIS_URL: string;

  // Email Configuration
  EMAIL_PROVIDER: string;
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_SECURE: boolean;
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
  EMAIL_FROM: string;

  // Stripe Configuration
  STRIPE_SECRET_KEY: string;

  // Shipping and Tax Configuration
  SHIPPING_COST: number;
  FREE_SHIPPING_THRESHOLD: number;
  TAX_RATE: number;

  // Frontend Configuration
  FRONTEND_URL: string;

  // Logging Configuration
  LOG_LEVEL: string;
  LOG_TO_FILE: boolean;
  LOG_DIR: string;

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_FOLDER: string;

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}

export const envValidationSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),

  // Database Configuration
  DATABASE_URL: Joi.string().required(),

  // JWT Configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),

  // Redis Configuration
  REDIS_URL: Joi.string().uri().required(),

  // Email Configuration
  EMAIL_PROVIDER: Joi.string()
    .valid(
      'gmail',
      'outlook',
      'yahoo',
      'sendgrid',
      'mailgun',
      'ses',
      'custom',
      'ethereal'
    )
    .default('custom'),
  EMAIL_HOST: Joi.string().hostname().default('smtp.ethereal.email'),
  EMAIL_PORT: Joi.number().port().default(587),
  EMAIL_SECURE: Joi.boolean().default(false),
  EMAIL_USER: Joi.string().email().optional(),
  EMAIL_PASS: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().default('noreply@exclusive.com'),

  // Stripe Configuration
  STRIPE_SECRET_KEY: Joi.string().required(),

  // Shipping and Tax Configuration
  SHIPPING_COST: Joi.number().positive().default(5.99),
  FREE_SHIPPING_THRESHOLD: Joi.number().positive().default(50),
  TAX_RATE: Joi.number().min(0).max(1).default(0.085),

  // Frontend Configuration
  FRONTEND_URL: Joi.string().uri().required(),

  // Logging Configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('info'),
  LOG_TO_FILE: Joi.boolean().default(false),
  LOG_DIR: Joi.string().default('./logs'),

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
  CLOUDINARY_FOLDER: Joi.string().default('uploads'),

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().required(),
});

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const { error, value } = envValidationSchema.validate(process.env, {
    allowUnknown: true,
    stripUnknown: true,
  });

  if (error) {
    console.error('❌ Environment validation failed:');
    console.error(
      error.details.map((detail) => `  - ${detail.message}`).join('\n')
    );
    console.error(
      '\nPlease check your .env file and ensure all required variables are set.'
    );
    process.exit(1);
  }

  // Convert string values to appropriate types
  const config: EnvironmentConfig = {
    ...value,
    PORT: parseInt(value.PORT as string),
    EMAIL_PORT: parseInt(value.EMAIL_PORT as string),
    EMAIL_SECURE: value.EMAIL_SECURE === 'true',
    LOG_TO_FILE: value.LOG_TO_FILE === 'true',
    SHIPPING_COST: parseFloat(value.SHIPPING_COST as string) || 5.99,
    FREE_SHIPPING_THRESHOLD:
      parseFloat(value.FREE_SHIPPING_THRESHOLD as string) || 50,
    TAX_RATE: parseFloat(value.TAX_RATE as string) || 0.085,
    CLOUDINARY_FOLDER: (value.CLOUDINARY_FOLDER as string) || 'uploads',
  };

  console.log('✅ Environment validation passed');
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`🚀 Server will start on port: ${config.PORT}`);

  return config;
};
