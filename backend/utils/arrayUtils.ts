type ResultEntry = {
    yolov5: any[];
    yolov8m_custom: any[];
};

type ModifiedResultEntry = {
    all: any[];
    nude: any[];
    time: number; 
};

type Results = {
    [key: string]: ResultEntry;
};

type FilteredResults = {
    [key: string]: ModifiedResultEntry;
};

type Total = {
    // totalFrames: number;  // Общее количество кадров
    objects: {       // Вложенный объект для подсчета объектов
        all: number;
        nude: number;
    };
    frames: {        // Вложенный объект для подсчета кадров с объектами
        all: number;
        nude: number;
    };
};

/**
 * Функция для фильтрации результатов и добавления времени кадра
 * @param results - Объект с результатами
 * @param fps - Количество кадров в секунду
 * @returns Объект с фильтрованными результатами и общим полем total
 */
export const filterResults = (results: Results | null, fps: number): { filteredResults: FilteredResults; total: Total } | null => {
    if (!results) {
        return null;
    }

    const filteredResults: FilteredResults = {}; // Объект с фильтрованными результатами

    let totalAllObjects = 0; // Общий счетчик для объектов all
    let totalNudeObjects = 0; // Общий счетчик для объектов nude
    let framesWithAll = 0; // Счетчик кадров с объектами all
    let framesWithNude = 0; // Счетчик кадров с объектами nude

    // Получаем отсортированные ключи
    const sortedKeys = Object.keys(results).sort((a, b) => {
        const numA = parseInt(a.replace('.png', ''), 10);
        const numB = parseInt(b.replace('.png', ''), 10);
        return numA - numB;
    });

    // Проходим по отсортированным ключам
    sortedKeys.forEach((key) => {
        const yolov5Array = results[key]?.yolov5 || [];
        const yolov8mCustomArray = results[key]?.yolov8m_custom || [];

        // Оставляем только те .png, где хотя бы один массив непустой
        if (yolov5Array.length > 0 || yolov8mCustomArray.length > 0) {
            // Извлекаем номер кадра из названия файла (например, 1.png -> 1)
            const frameNumber = parseInt(key.replace('.png', ''), 10);
            const time = frameNumber / fps; // Вычисляем время на основе fps

            filteredResults[key] = {
                all: yolov5Array,
                nude: yolov8mCustomArray,
                time, // Добавляем поле time
            };

            // Увеличиваем счетчики количества объектов
            totalAllObjects += yolov5Array.length;
            totalNudeObjects += yolov8mCustomArray.length;

            // Увеличиваем счетчики количества фреймов с распознанными объектами
            if (yolov5Array.length > 0) {
                framesWithAll++;
            }
            if (yolov8mCustomArray.length > 0) {
                framesWithNude++;
            }
        }
    });

    // Возвращаем объект с результирующими данными и общим полем total
    return {
        filteredResults,
        total: {
            objects: { // Общее количество объектов в каждой категории
                all: totalAllObjects,
                nude: totalNudeObjects,
            },
            frames: { // Количество кадров с объектами в каждой категории
                all: framesWithAll,
                nude: framesWithNude,
            },
        },
    };
};
