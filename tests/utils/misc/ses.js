/* eslint-disable @typescript-eslint/no-unused-vars */
const SES = require('aws-sdk/clients/ses');
const { FaultHandled } = require('../../util/error');

const ses = new SES({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
});

module.exports = {
  /**
   * Publishes message to SNS
   *
   * @param {Object} publishParams Params for the message as seen on AWS SDK. Message will be converted to string if needed.
   * @param {Object} eventMeta Event meta to keep track of the flow.
   */
  sendEmail: async (params, eventMeta) => {
    try {
      const publishParams = {
        Destination: {
          ToAddresses: Array.isArray(params.destination)
            ? params.destination
            : [params.destination],
        },
      };
      publishParams.Source = params.source;
      publishParams.Message = {
        Body: {},
        Subject: {
          Data:
            typeof params.title !== 'string'
              ? JSON.stringify(params.title)
              : params.title,
          Charset: 'UTF-8',
        },
      };

      if (params.message?.text) {
        publishParams.Message.Body = {
          Text: {
            Charset: 'UTF-8',
            Data:
              typeof params.message.text !== 'string'
                ? JSON.stringify(params.message.text)
                : params.message.text,
          },
        };
      } else if (params.message?.html) {
        publishParams.Message.Body = {
          Html: {
            Charset: 'UTF-8',
            Data:
              typeof params.message.html !== 'string'
                ? JSON.stringify(params.message.html)
                : params.message.html,
          },
        };
      }
      console.log('MARTIN_LOG>=> SES params', JSON.stringify(publishParams));
      const response = await ses
        .sendEmail(publishParams)
        .promise()
        .catch((error) => {
          throw error;
        });
      return { email_message_id: response.MessageId };
    } catch (error) {
      throw FaultHandled.captureUnhanlded(error, {
        code: 'SEND EMAIL',
        layer: 'SEND EMAIL LOCAL_STACK',
      });
    }
  },
};
