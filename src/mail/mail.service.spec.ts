/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer'); // Mock do nodemailer

describe('MailService', () => {
  let service: MailService;
  let configService: ConfigService;
  let transporterMock: jest.Mocked<nodemailer.Transporter>;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'EMAIL_USER') return 'testuser@example.com';
              if (key === 'EMAIL_PASS') return 'testpass';
              return null;
            }),
          },
        },
      ],
    })
      .overrideProvider(nodemailer.createTransport)
      .useValue(transporterMock)
      .compile();

    service = module.get<MailService>(MailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const formData = {
        nome: 'John Doe',
        email: 'john.doe@example.com',
        telefone: '123456789',
        projeto: 'Project 1',
        ensinado: 'Topic 1',
        vender: '1000',
        modalidade: 'Online',
        mensagem: 'Test message',
      };

      transporterMock.sendMail.mockResolvedValueOnce({ messageId: '123' });

      const result = await service.sendEmail(formData);
      expect(result).toEqual({ message: 'E-mail enviado com sucesso!' });
      expect(transporterMock.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'testuser@example.com',
          to: 'testuser@example.com',
          subject: 'Info Produto - John Doe',
        }),
      );
    });

    it('should throw an error when email sending fails', async () => {
      const formData = {
        nome: 'John Doe',
        email: 'john.doe@example.com',
        telefone: '123456789',
        projeto: 'Project 1',
        ensinado: 'Topic 1',
        vender: '1000',
        modalidade: 'Online',
        mensagem: 'Test message',
      };

      transporterMock.sendMail.mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(service.sendEmail(formData)).rejects.toThrow('Erro ao enviar e-mail');
    });
  });

  describe('novoEmail', () => {
    it('should send novo email successfully', async () => {
      const formData2 = {
        nome: 'Jane Doe',
        email: 'jane.doe@example.com',
        telefone: '987654321',
        especialidade: 'Especialidade 1',
        experiencia: 'Experiencia 1',
      };

      transporterMock.sendMail.mockResolvedValueOnce({ messageId: '456' });

      const result = await service.novoEmail(formData2);
      expect(result).toEqual({ message: 'E-mail enviado com sucesso!' });
      expect(transporterMock.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'testuser@example.com',
          to: 'testuser@example.com',
          subject: 'Proposta Novo Colunista - Jane Doe',
        }),
      );
    });

    it('should throw an error when novo email sending fails', async () => {
      const formData2 = {
        nome: 'Jane Doe',
        email: 'jane.doe@example.com',
        telefone: '987654321',
        especialidade: 'Especialidade 1',
        experiencia: 'Experiencia 1',
      };

      transporterMock.sendMail.mockRejectedValueOnce(new Error('Failed to send email'));

      await expect(service.novoEmail(formData2)).rejects.toThrow('Erro ao enviar e-mail');
    });
  });
});
