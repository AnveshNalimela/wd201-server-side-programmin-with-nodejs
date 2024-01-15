"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Todo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Todo.belongsTo(models.User, {
                foreignKey: 'UserId',
            })
            // define association here
        }

        static addTodo({ title, dueDate, UserId }) {
            return this.create({ title: title, dueDate: dueDate, completed: false, UserId });
        }
        static deleteTodo(id) {
            return this.destroy({ where: { id: id } });
        }
        markAsCompleted() {
            return this.update({ completed: true });
        }
        
        static async setCompletionStatus(id, val, UserId) {
            const todo = await this.findByPk(id);
            todo.completed = val;
            await todo.save();
            return todo;
        }


        static getTodos() {
            return this.findAll();

        }

        static async remove(id, UserId) {
            return this.destroy({
                where: {
                    id,
                    UserId,
                },

            })
        }


        static async isDueLater(UserId) {
            return this.findAll({
                where: {
                    dueDate: {
                        [Op.gt]: new Date().toISOString().split("T")[0],
                    },
                    UserId,
                    completed: false,
                },
                order: [["id", "ASC"]],
            });
        }

        static async isOverdue(UserId) {
            return this.findAll({
                where: {
                    dueDate: {
                        [Op.lt]: new Date().toISOString().split("T")[0],
                    },
                    completed: false,
                    UserId,
                },
                order: [["id", "ASC"]],
            });
        }

        static async isDueToday(UserId) {
            return this.findAll({
                where: {
                    dueDate: {
                        [Op.eq]: new Date().toISOString().split("T")[0],
                    },
                    UserId,
                    completed: false,
                },
                order: [["id", "ASC"]],
            });
        }

        static isCompleted(UserId) {
            //In order to get only completed Todos
            return this.findAll({
                where: { completed: true },
                UserId,
                order: [["id", "ASC"]],
            });
        }
    }
    Todo.init(
        {
            title: DataTypes.STRING,
            dueDate: DataTypes.DATEONLY,
            completed: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "Todo",
        }
    );
    return Todo;
};

