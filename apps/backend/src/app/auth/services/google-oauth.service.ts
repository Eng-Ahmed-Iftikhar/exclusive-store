import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import axios from 'axios';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly googleTokenUrl = 'https://oauth2.googleapis.com/token';
  private readonly googleUserInfoUrl =
    'https://www.googleapis.com/oauth2/v2/userinfo';

  constructor(private configService: ConfigService) {}

  async exchangeCodeForToken(
    code: string,
    redirectUri: string
  ): Promise<GoogleTokenResponse> {
    try {
      const response = await axios.post(
        this.googleTokenUrl,
        {
          client_id: this.configService.googleClientId,
          client_secret: this.configService.googleClientSecret,
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to exchange code for token');
    }
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await axios.get(this.googleUserInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new BadRequestException('Failed to get user info from Google');
    }
  }

  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.configService.googleClientId,
      redirect_uri: this.configService.googleCallbackUrl,
      scope: 'email profile',
      response_type: 'code',
      access_type: 'offline',
    });

    if (state) {
      params.append('state', state);
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }
}
