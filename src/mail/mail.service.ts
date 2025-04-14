/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private mailchimpUrl: string;
  private mailchimpApiKey: string;
  private mailchimpAudienceId: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    this.mailchimpApiKey = this.configService.get<string>('MAILCHIMP_API_KEY');
    this.mailchimpAudienceId = this.configService.get<string>(
      'MAILCHIMP_AUDIENCE_ID',
    );
    this.mailchimpUrl =
      this.configService.get<string>('MAILCHIMP_API_URL') +
      `/lists/${this.mailchimpAudienceId}/members`;
  }

  private getSubscriberHash(email: string): string {
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  async sendEmail(formData: any) {
    const {
      nome,
      email,
      telefone,
      projeto,
      ensinado,
      vender,
      modalidade,
      mensagem,
    } = formData;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: this.configService.get<string>('EMAIL_USER'),
      subject: `Info Produto - ${nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007bff;">Info Produto</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td><strong>Nome:</strong></td><td>${nome}</td></tr>
            <tr><td><strong>E-mail:</strong></td><td>${email}</td></tr>
            <tr><td><strong>Telefone:</strong></td><td>${telefone}</td></tr>
            <tr><td><strong>Projeto:</strong></td><td>${projeto}</td></tr>
            <tr><td><strong>O que será ensinado:</strong></td><td>${ensinado}</td></tr>
            <tr><td><strong>Valor de venda:</strong></td><td>${vender}</td></tr>
            <tr><td><strong>Modalidade:</strong></td><td>${modalidade}</td></tr>
            <tr><td><strong>Mensagem:</strong></td><td>${mensagem}</td></tr>
          </table>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);

      const subscriberHash = this.getSubscriberHash(email);

      const data = {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
          FNAME: nome,
          PHONE: telefone,
          PROJETO: projeto,
          ENSINADO: ensinado,
          VENDER: vender,
          MODALIDADE: modalidade,
          MENSAGEM: mensagem,
        },
        tags: ['info_produto'],
      };

      await axios.put(`${this.mailchimpUrl}/${subscriberHash}`, data, {
        auth: { username: 'anystring', password: this.mailchimpApiKey },
      });

      return {
        message: 'E-mail enviado e usuário cadastrado/atualizado no Mailchimp!',
      };
    } catch (error) {
      console.error('Erro:', error.response?.data || error.message);
      throw new Error('Erro ao processar solicitação');
    }
  }

  async novoEmail(formData2: any) {
    const { nome, email, telefone, especialidade, tema, experiencia } =
      formData2;

    const mailOptions2 = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: this.configService.get<string>('EMAIL_USER'),
      subject: `Proposta Novo Colunista - ${nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007bff;">Proposta Novo Colunista</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td><strong>Nome:</strong></td><td>${nome}</td></tr>
            <tr><td><strong>E-mail:</strong></td><td>${email}</td></tr>
            <tr><td><strong>Telefone:</strong></td><td>${telefone}</td></tr>
            <tr><td><strong>Tema:</strong></td><td>${tema}</td></tr>
            <tr><td><strong>Especialidade:</strong></td><td>${especialidade}</td></tr>
            <tr><td><strong>Experiência:</strong></td><td>${experiencia}</td></tr>
          </table>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions2);

      const subscriberHash = this.getSubscriberHash(email);

      const data = {
        email_address: email,
        status_if_new: 'subscribed',
        merge_fields: {
          FNAME: nome,
          PHONE: telefone,
          ESPECIALIDADE: especialidade,
          TEMA: tema,
          EXPERIENCIA: experiencia,
        },
        tags: ['novo_colunista'],
      };

      await axios.put(`${this.mailchimpUrl}/${subscriberHash}`, data, {
        auth: { username: 'anystring', password: this.mailchimpApiKey },
      });

      return {
        message: 'E-mail enviado e usuário cadastrado/atualizado no Mailchimp!',
      };
    } catch (error) {
      console.error('Erro:', error.response?.data || error.message);
      throw new Error('Erro ao processar solicitação');
    }
  }
}
