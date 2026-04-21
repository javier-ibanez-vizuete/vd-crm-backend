export const normalizeEmail = (email: string): string | null => {
    if (!email.includes("@")) return null;

    let localPart = email.split("@")[0];
    let domainPart = email.split("@")[1];

    if (!domainPart.includes("gmail.com")) return email.trim().toLocaleLowerCase()

    if (localPart.includes(".")) {
        localPart = localPart.replaceAll(".", "");
    }
    if (localPart.includes("+")) {
        localPart = localPart.split("+")[0];
    }

    const normalizedEmail = `${localPart}@${domainPart}`;

    return normalizedEmail.trim().toLowerCase();
}

// TODO: METER DOS CAMPOS DE EMAIL UNO PARA SERVICIOS Y OTRO PARA GUARDAR Y VALIDAR EN LA BASE DE DATOS