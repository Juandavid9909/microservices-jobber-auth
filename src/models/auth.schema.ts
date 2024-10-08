import { DataTypes, Model, ModelDefined, Optional } from "sequelize";
import { compare, hash } from "bcryptjs";
import { IAuthDocument } from "@juandavid9909/jobber-shared";
import { sequelize } from "@auth/database";

const SALT_ROUND = 10;

type AuthUserCreationAttributes = Optional<IAuthDocument, "id" | "createdAt" | "passwordResetToken" | "passwordResetExpires">;

const AuthModel: ModelDefined<IAuthDocument, AuthUserCreationAttributes> = sequelize.define("auths", {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePublicId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Date.now
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ["email"]
    },
    {
      unique: true,
      fields: ["username"]
    }
  ]
});

AuthModel.addHook("beforeCreate", async (auth: Model) => {
  const hashedPassword: string = await hash(auth.dataValues.password as string, SALT_ROUND);

  auth.dataValues.password = hashedPassword;
});

AuthModel.prototype.comparePassword = async function(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
};

AuthModel.sync({ force: true });

export { AuthModel };
