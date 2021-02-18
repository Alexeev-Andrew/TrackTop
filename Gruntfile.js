/**
 * Created by Andrew.
 */
//let uglify = require('grunt-contrib-uglify');


module.exports = function(grunt) {
    //Налаштування збірки Grunt
    var config = {
        //Інформацію про проект з файлу package.json
        pkg: grunt.file.readJSON('package.json'),
        less: {
            dev: {
                options: {
                    compress: true
                },
                files: {
                    "Frontend/www/assets/less/all.css": "Frontend/www/assets/less/main.less" // destination: source
                }
            }
        },
            //Конфігурація для модуля browserify (перетворює require(..) в код
            browserify: {
                //Загальні налаштування (grunt-browserify)
                options: {

                        //brfs замість fs.readFileSync вставляє вміст файлу
                        transform: [require('brfs')],
                        browserifyOptions: {
                            //Папка з корнем джерельних кодів javascript
                            basedir: "Frontend/src/js/"
                        }
                    },

                    //Збірка
                    trackTop: {
                        src: 'Frontend/src/main.js',
                        dest: 'Frontend/www/assets/js/main.js'
                    },
                    technics: {
                        src: 'Frontend/src/technics/technicsMain.js',
                        dest: 'Frontend/www/assets/js/technicsMain.js'
                    },
                    equipments: {
                        src: 'Frontend/src/technics/equipmentsCategoriesMain.js',
                        dest: 'Frontend/www/assets/js/equipmentsMain.js'
                    },
                    equipmentsByCategory: {
                        src: 'Frontend/src/technics/equipmentsByCategory.js',
                        dest: 'Frontend/www/assets/js/equipmentsByCategory.js'
                    },
                    oneTechnic: {
                        src: 'Frontend/src/technics/technicMain.js',
                        dest: 'Frontend/www/assets/js/oneTechnicMain.js'
                    },
                    oneEquipment: {
                        src: 'Frontend/src/technics/equipmentMain.js',
                        dest: 'Frontend/www/assets/js/oneEquipmentMain.js'
                    },
                    profile: {
                        src: 'Frontend/src/profile/main_profile.js',
                        dest: 'Frontend/www/assets/js/profile_main.js'
                    },
                    adminPanel: {
                        src: 'Frontend/src/adminPanel/allTechnicsScript.js',
                        dest: 'Frontend/www/assets/js/adminPanel.js'
                    }
                },

    };

    //Налаштування відстежування змін в проекті
    var watchDebug = {
        options: {
            'no-beep': true
        },
        //Назва завдання будь-яка
        scripts: {
            //На зміни в яких файлах реагувати
                files: ['Frontend/src/**/*.js', 'Frontend/**/*.ejs'],
                //Які завдання виконувати під час зміни в файлах
                tasks: ['browserify:trackTop', 'uglify:trackTop']
        }
    };


    //Ініціалузвати Grunt
    config.watch = watchDebug;
    grunt.initConfig(config);

    //Сказати які модулі необхідно виокристовувати
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['uglify']);
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('default', ['less']);
    //Список завданнь за замовчуванням
    grunt.registerTask('default',
        [
            'browserify:trackTop',
            'browserify:technics',
            'browserify:equipments',
            'browserify:oneTechnic',
            'browserify:profile',
            'browserify:adminPanel',
            'browserify:oneEquipment',
            'browserify:equipmentsByCategory',
            //Інші завдання які необхідно виконати
        ]
    );

};