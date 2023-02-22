export const exists = async <Model extends { count: any }>(model: Model, args: Parameters<Model["count"]>[0]): Promise<boolean> => {
    const count = await model.count(args);
    return Boolean(count);
};
