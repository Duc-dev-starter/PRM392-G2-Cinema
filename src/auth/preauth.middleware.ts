/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as firebase from 'firebase-admin';
import * as serviceAccount from './firebaseServiceAccount.json';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PreauthMidlleWare implements NestMiddleware {
  private defaultApp: firebase.app.App;

  constructor(private configService: ConfigService) {
    // Check if Firebase is already initialized
    try {
      this.defaultApp = firebase.app();
      console.log('Using existing Firebase app');
    } catch (error) {
      // Initialize Firebase if not already initialized
      try {
        // Get project details from the service account file
        const projectId = serviceAccount.project_info.project_id;
        const storageBucket = serviceAccount.project_info.storage_bucket;

        // Get the web client ID from the service account
        const webClientId = serviceAccount.client[0].oauth_client.find(
          (client) => client.client_type === 3,
        )?.client_id;

        this.defaultApp = firebase.initializeApp({
          credential: firebase.credential.cert({
            projectId: projectId,
            // Use the service account email format based on project ID
            clientEmail: `firebase-adminsdk-fbsvc@${projectId}.iam.gserviceaccount.com`,
            // Get private key from environment variables
            privateKey: this.configService
              .get<string>('FIREBASE_PRIVATE_KEY')
              ?.replace(/\\n/g, '\n'),
          }),
          databaseURL: `https://${projectId}.firebaseio.com`,
          storageBucket: storageBucket,
        });
        console.log(
          'Firebase initialized successfully with project:',
          projectId,
        );
      } catch (initError) {
        console.error('Firebase initialization error:', initError);
        throw initError; // Re-throw to fail fast if Firebase can't be initialized
      }
    }
  }

  use(req: Request, res: Response, next: Function) {
    // First check Authorization header
    let token = req.headers.authorization;

    // If no token in header, check query parameters (for loginWithGoogle endpoint)
    if (!token && req.query.token) {
      token = req.query.token as string;
    }

    if (token != null && token != '') {
      const tokenToVerify = token.startsWith('Bearer ')
        ? token.replace('Bearer ', '')
        : token;

      console.log(
        'Attempting to verify token:',
        tokenToVerify.substring(0, 20) + '...',
      );

      this.defaultApp
        .auth()
        .verifyIdToken(tokenToVerify)
        .then(async (decodedToken) => {
          console.log(
            'Token verified successfully, user email:',
            decodedToken.email,
          );
          const user = {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
            uid: decodedToken.uid,
          };
          req['user'] = user;
          next();
        })
        .catch((error) => {
          console.error('Token verification failed:', error.message);
          this.accessDenied(req.url, res);
        });
    } else {
      console.log('No token provided for path:', req.url);
      next();
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      success: false,
      message: 'Access Denied',
      errors: [],
    });
  }
}
