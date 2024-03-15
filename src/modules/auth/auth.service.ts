import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { OTPEntity } from "../user/entities/otp.entity";
import { CheckOtpDto, SendOtpDto } from "./dto/auth.dto";
import { randomInt } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OTPEntity) private otpRepository: Repository<OTPEntity>
  ) {}
  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;
    let user = await this.userRepository.findOneBy({ mobile });
    if (!user) {
      user = this.userRepository.create({
        mobile,
      });
      user = await this.userRepository.save(user);
    }
    await this.createOtpForUser(user);
    return {
      message: "send code successfully",
    };
  }
  async checkOtp(otpDto: CheckOtpDto) {
    const { mobile, code } = otpDto;
    const now = new Date();
    const user = await this.userRepository.findOne({
      where: { mobile },
      relations: {
        otp: true,
      },
    });
    if (!user || !user?.otp)
      throw new UnauthorizedException("Not Found Account With This Number");
    const otp = user?.otp;
    if (otp?.code !== code) {
      throw new UnauthorizedException("code is incorrect");
    }
    if (otp?.expires_in < now) {
      throw new UnauthorizedException("code is expired");
    }
    if (!user.mobile_verify) {
      await this.userRepository.update(
        {
          id: user.id,
        },
        { mobile_verify: true }
      );
    }
    return {
      message: "You logged-in successfully",
    };
  }
  async createOtpForUser(user: UserEntity) {
    const expiresIn = new Date(new Date().getTime() + 1000 * 60 * 2);
    const code = randomInt(10000, 99999).toString();
    let otp = await this.otpRepository.findOneBy({ userId: user.id });
    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("otp code not expired");
      }
      otp.code = code;
      otp.expires_in = expiresIn;
    } else {
      otp = this.otpRepository.create({
        code,
        expires_in: expiresIn,
        userId: user.id,
      });
    }
    otp = await this.otpRepository.save(otp);
    user.otpId = otp.id;
    await this.userRepository.save(user);
  }
}
