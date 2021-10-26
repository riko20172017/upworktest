import { ref, onMounted, watch, computed } from 'vue'

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

export default function useFormValidation(arg: { name: string, rules: Rule }[]) {
    const fields = ref<Field[]>([])

    console.log(fields.value);


    arg.forEach((el => fields.value.push(new Field(el.name, el.rules))))

    function getMessage(fieldName: string) {
        for (let i = 0; i < fields.value.length; i++) {
            const field = fields.value[i];
            if (field.name === fieldName) {
                return field.message
            }
        }
        return ""
    }

    function isValid(fieldName: string) {
        for (let i = 0; i < fields.value.length; i++) {
            const field = fields.value[i];
            if (field.name === fieldName) {
                return field.message.length == 0
            }
        }
    }

    /**
     * wasValid
     */
    function wasValidate(fieldName: string) {
        for (let i = 0; i < fields.value.length; i++) {
            const field = fields.value[i];
            if (field.name === fieldName) {
                return field.wasValidate
            }
        }
    }

    /**
     * changeValue
     */
    function changeValue(name: string, value: string): boolean {
        for (let i = 0; i < fields.value.length; i++) {
            const field = fields.value[i];
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
    function getFieldValue(name: string): string {
        return <string>fields.value.find(field => field.name == name)?.getValue()
    }

    function validate(name: string): void {
        const field = fields.value.find(field => field.name == name)
        if (field) {
            field.checkRules();
        }
    }

    /**
     * isValid
     */
    function isFormValid() {
        fields.value.forEach(field => {
            field.checkRules()
            field.doDirty();
        })
        return fields.value.every(field => field.message == "")
    }

    /**
     * clear
     */
    function clear() {
        fields.value.map((field) => {
            field.value = "";
            field.wasValidate = false
            return field
        })
    }

    /**
     * getValues
     */
    function getValues() {
        let values: {
            [key: string]: string
        } = {}
        fields.value.map(field => {
            values[field.name] = field.value
        })
        return values
    }

    /**
     * addServerErrors
     */
    function addServerErrors(messages: { name: string, message: string }[]) {
        messages.forEach(({ name, message }) => {
            fields.value.map(field => {
                if (field.name == name) {
                    field.message = message
                }
            })
        })
    }

    function handleChange(name: string) {
        validate(name);
    }

    function handleInput(target: {
        name: string;
        value: string;
    }) {
        changeValue(target.name, target.value);
    }

    return {
        addServerErrors,
        getValues,
        isFormValid,
        validate,
        getFieldValue,
        changeValue,
        wasValidate,
        isValid,
        getMessage,
        handleChange,
        handleInput
    }
}
