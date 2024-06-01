import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  CognitoIdentityProvider,
  AdminCreateUserCommandOutput,
  ForgotPasswordCommandOutput,
  ConfirmForgotPasswordCommandOutput,
  AdminRespondToAuthChallengeCommandOutput,
  AdminInitiateAuthCommandOutput,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoRepositoryInterface } from './interfaces/cognitoServiceInterface';

const USER_POOL_ID = process.env.USER_POOL_ID as string;
const USER_CLIENT_ID = process.env.USER_CLIENT_ID as string;
const AWS_REGION = process.env.AWS_REGION as string;

const cognitoOptions = {
  region: AWS_REGION,
};

/**
 * Clase para interactuar con el servicio de Cognito de AWS.
 * @implements {CognitoRepositoryInterface}
 */
export default class CognitoRepository implements CognitoRepositoryInterface {
  private client: CognitoIdentityProviderClient;

  private cognito: CognitoIdentityProvider;

  constructor() {
    this.client = new CognitoIdentityProviderClient(cognitoOptions);
    this.cognito = new CognitoIdentityProvider(cognitoOptions);
    console.log('MARTIN_LOG=> CognitoRepository =>constructor=> ', this);
  }

  /**
   * Crea un nuevo usuario en Cognito.
   * @param {string} username - El nombre de usuario.
   * @param {string} temporaryPassword - La contraseña temporal.
   * @param {string} email - El correo electrónico del usuario.
   * @param {string} role - El rol del usuario.
   * @returns {Promise<AdminCreateUserCommandOutput>} - La respuesta de la creación del usuario.
   * @throws {Error} - Si ocurre un error al crear el usuario.
   */
  async createUser(
    username: string,
    temporaryPassword: string,
    email: string,
    role: string
  ): Promise<AdminCreateUserCommandOutput> {
    try {
      const command = new AdminCreateUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: username,
        TemporaryPassword: temporaryPassword,
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
          {
            Name: 'email_verified',
            Value: 'true',
          },
          { Name: 'custom:role', Value: role },
        ],
        MessageAction: 'SUPPRESS',
      });

      const response = await this.client.send(command);

      console.log(
        'MARTIN_LOG=> CognitoRepository=>createUser=>response: ',
        response
      );

      return response;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw error;
    }
  }

  /**
   * Autentica un usuario en Cognito.
   * @param {string} username - El nombre de usuario.
   * @param {string} password - La contraseña del usuario.
   * @returns {Promise<AdminInitiateAuthCommandOutput>} - La respuesta de la autenticación del usuario.
   * @throws {Error} - Si ocurre un error al autenticar el usuario.
   */
  async authenticateUser(
    username: string,
    password: string
  ): Promise<AdminInitiateAuthCommandOutput> {
    try {
      // Implementar autenticación de usuario
      console.log('MARTIN_LOG=> CognitoRepository=>authenticateUser=>', {
        username,
        password,
        USER_CLIENT_ID,
      });

      const params = new AdminInitiateAuthCommand({
        UserPoolId: USER_POOL_ID,
        ClientId: USER_CLIENT_ID,
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      }).input;

      const response = await this.cognito.adminInitiateAuth(params);

      console.log(
        'MARTIN_LOG=>CognitoRepository=>authenticateUser=>response: ',
        JSON.stringify(response)
      );

      return response; // or return AccessToken if you need it
    } catch (error) {
      console.error('Error during authentication:', error);
      throw error;
    }
  }

  /**
   * Cambia la contraseña de un usuario en Cognito.
   * @param {string} username - El nombre de usuario.
   * @param {string} newPassword - La nueva contraseña del usuario.
   * @param {string} session - La sesión de autenticación del usuario.
   * @returns {Promise<AdminRespondToAuthChallengeCommandOutput>} - La respuesta del cambio de contraseña.
   * @throws {Error} - Si ocurre un error al cambiar la contraseña del usuario.
   */
  async changePassword(
    username: string,
    newPassword: string,
    session: string
  ): Promise<AdminRespondToAuthChallengeCommandOutput> {
    // Implementar cambio de contraseña
    console.log('MARTIN_LOG=> CognitoRepository=>changePassword=>', {
      username,
      newPassword,
    });
    try {
      const params = new AdminRespondToAuthChallengeCommand({
        UserPoolId: USER_POOL_ID,
        ClientId: USER_CLIENT_ID,
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        Session: session,
        ChallengeResponses: {
          USERNAME: username,
          NEW_PASSWORD: newPassword,
        },
      }).input;

      const response = await this.cognito.adminRespondToAuthChallenge(params);
      console.log(
        'MARTIN_LOG=> CognitoRepository=>changePassword=>response: ',
        response
      );

      return response;
    } catch (error) {
      console.error('Error during password change:', error);
      throw error;
    }
  }

  /**
   * Recupera la contraseña de un usuario en Cognito.
   * @param {string} username - El nombre de usuario.
   * @returns {Promise<ForgotPasswordCommandOutput>} - La respuesta de la recuperación de contraseña.
   * @throws {Error} - Si ocurre un error al recuperar la contraseña del usuario.
   */
  async forgotPassword(username: string): Promise<ForgotPasswordCommandOutput> {
    // Implementar recuperación de contraseña
    console.log('MARTIN_LOG=> CognitoRepository=>forgotPassword=>', {
      username,
    });
    try {
      const params = new ForgotPasswordCommand({
        ClientId: USER_CLIENT_ID,
        Username: username,
      }).input;

      const response = await this.cognito.forgotPassword(params);

      console.log(
        'MARTIN_LOG=> CognitoRepository=>forgotPassword=>response: ',
        response
      );
      return response;
    } catch (error) {
      console.error('Error during password recovery:', error);
      throw error;
    }
  }

  /**
   * Confirma la recuperación de la contraseña de un usuario en Cognito.
   * @param {string} username - El nombre de usuario.
   * @param {string} code - El código de confirmación.
   * @param {string} newPassword - La nueva contraseña del usuario.
   * @returns {Promise<ConfirmForgotPasswordCommandOutput>} - La respuesta de la confirmación de la recuperación de contraseña.
   * @throws {Error} - Si ocurre un error al confirmar la recuperación de la contraseña del usuario.
   */
  async confirmForgotPassword(
    username: string,
    code: string,
    newPassword: string
  ): Promise<ConfirmForgotPasswordCommandOutput> {
    console.log('MARTIN_LOG=> CognitoRepository=>confirmForgotPassword=>', {
      username,
      code,
      newPassword,
    });

    try {
      const params = new ConfirmForgotPasswordCommand({
        ClientId: USER_CLIENT_ID,
        Username: username,
        ConfirmationCode: code,
        Password: newPassword,
      }).input;

      const response = await this.cognito.confirmForgotPassword(params);

      console.log(
        'MARTIN_LOG=> CognitoRepository=>confirmForgotPassword=>response: ',
        response
      );

      return response;
    } catch (error) {
      console.error('Error during password recovery confirmation:', error);
      throw error;
    }
  }
}
