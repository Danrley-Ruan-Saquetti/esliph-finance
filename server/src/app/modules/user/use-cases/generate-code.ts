import { BadRequestException } from '@exceptions/bad-request'
import { CodeGenerator } from '@services/code-generator'
import { UserModel } from '@modules/user/model'
import { GLOBAL_USER_DTO } from '@modules/user/global'

const { userRepository } = UserModel

const codeGenerator = new CodeGenerator(
    GLOBAL_USER_DTO.code.template.template,
    GLOBAL_USER_DTO.code.template.charactersToReplace,
    GLOBAL_USER_DTO.code.template.valuesAllowed,
)

export async function generateCode(attempts = 3) {
    const code = await codeGenerator.generate(attempts, async (code) => {
        return !(await userRepository.isExists({ where: { code } }))
    })

    if (!code)
        throw new BadRequestException({ title: 'Generate code user', message: 'Unable to generate user code. Please try again later' })

    return { code }
}