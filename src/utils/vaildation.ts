type Rule = Array<'email' | 'empty' | [number, number]>

class Field {
    name: string = ""
    rules: Rule = [];
    message: string = "";
    wasValidate: boolean = false;
    value: string = ""

    constructor(name: string, rules: Rule) {
        this.name = name
        this.rules = rules
    }

    /**
     * checkRules
     */
    public checkRules() {
        this.message = "";
        this.rules.forEach((rule => {
            if (rule instanceof Array) {
                const [min, max] = rule;
                if (!this.isInRang(min, max))
                    this.message = `Min is ${min} and max is ${max}`
            }
            if (rule === "email") {
                if (!this.isEmail())
                    this.message = `Input correct email`

            }
            if (rule === "empty") {
                if (this.isEmpty())
                    this.message = `Field shoudnt be empty`
            }
        }))
    }

    /**
 * validateRange
 */
    public isInRang(min: number, max: number) {
        if (this.value.length >= min && this.value.length <= max) {
            return true
        }
        return false
    }

    /**
     * validateEmail
     */

    public isEmail(): boolean {
        var re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.value);
    }


    /**
     * validateEmpty
     */
    public isEmpty() {
        if (this.value === "") {
            return true
        }
        return false
    }

    /**
     * doDirty
     */
    public doDirty() {
        this.wasValidate = true;
    }

    /**
     * getValue
     */
    public getValue() {
        return this.value
    }
}

export class Validation {
    fields: Array<Field> = []

    constructor(arg: { name: string, rules: Rule }[]) {
        arg.forEach((el => this.fields.push(new Field(el.name, el.rules))))
    }

    getMessage(fieldName: string) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (field.name === fieldName) {
                return field.message
            }
        }
        return ""
    }

    isValid(fieldName: string) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (field.name === fieldName) {
                return field.message.length == 0
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

    /**
     * changeValue
     */
    public changeValue(name: string, value: string): boolean {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (field.name == name) {
                field.value = value
                return true
            }
        }
        return false
    }

    /**
     * getFieldValue
     */
    public getFieldValue(name: string): string | undefined {
        return this.fields.find(field => field.name == name)?.getValue()
    }

    validateAll() {
        this.fields.forEach(field => {
            field.checkRules()
            field.doDirty();
        })
    }

    validate(name: string): void {
        const field = this.fields.find(field => field.name == name)
        if (field) {
            field.checkRules();
        }
    }

    /**
     * isValid
     */
    public isFormValid() {
        return this.fields.every(field => field.message == "")
    }

    /**
     * clear
     */
    public clear() {
        this.fields.map((field) => {
            field.value = "";
            field.wasValidate = false
            return field
        })
    }

    /**
     * getValues
     */
    public getValues() {
        let values: {
            [key: string]: string
        } = {}
        this.fields.map(field => {
            values[field.name] = field.value
        })
        return values
    }

    /**
     * addServerErrors
     */
    public addServerErrors(messages: { name: string, message: string }[]) {
        messages.forEach(({ name, message }) => {
            this.fields.map(field => {
                if (field.name == name) {
                    field.message = message
                }
            })
        })
    }




}
