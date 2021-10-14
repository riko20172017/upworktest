type Rule = Array<'email' | 'empty' | [number, number]>

export interface IFieldV {
    name: string
    rules: Rule;
    messages: string[],
    wasValidate: boolean,
    value: string,
}

export class Validation {
    fields: Array<IFieldV> = []

    add(name: string, rules: Rule): void {
        const state = {
            messages: [],
            wasValidate: false,
            value: "",
        }
        this.fields.push(Object.assign({}, { name, rules }, state));
    }

    getMessages(fieldName: string) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (field.name === fieldName) {
                return field.messages
            }
        }
        return []
    }

    isValid(fieldName: string) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (field.name === fieldName) {
                return field.messages.length == 0
            }
        }
    }

    /**
     * wasValid
     */
    public wasValidate(fieldName: string) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (field.name === fieldName) {
                return field.wasValidate
            }
        }
    }

    validate(name: string, value: string) {

        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (field.name == name) {
                field.wasValidate = true;
                for (let j = 0; j < field.rules.length; j++) {
                    const rule = field.rules[j];
                    if (rule instanceof Array) {
                        const [min, max] = rule;
                        if (value.length < min || value.length > max) {
                            field.messages.length = 0;
                            field.messages.push(`Min is ${min} and max is ${max}`)
                            return false
                        }
                    }
                    if (rule === "email") {
                        if (!this.validEmail(value)) {
                            field.messages = [];
                            field.messages.push(`Input correct email`)
                            return false
                        }
                    }
                    if (rule === "empty") {
                        if (value === "") {
                            field.messages.length = 0;
                            field.messages.push(`Field shoudnt be empty`)
                            return false
                        }
                    }
                }
            }
        }
        return true
    }

    validEmail(email: string): boolean {
        var re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}
