import { UserConst, ApiPrefix } from "../Constant"
import AppDispatcher from "../Dispatcher"
import BaseStore from "./BaseStore"

class UserStore extends BaseStore {
    /**
     * constructor
     */
    constructor() {
        super();

        this.dispatchToken = AppDispatcher.register( (action) => {
            switch (action.type) {
                case UserConst.LOAD_USER:
                    this.loadUser(action.forceFlag);
                break;
                case UserConst.UPDATE_MY_PROFILE:
                    this.updateMyProfile(action.data);
                break;
                case UserConst.LOAD_ALL:
                    this.loadAll(action.forceFlag);
                break;
                case UserConst.LOGIN:
                    this.login(action.email, action.pwd);
                break;
            }
        });
    }

    login(email, pwd) {

        var formData = {
            email: email, 
            password: pwd,
        };
        this.ajax("post", ApiPrefix + "/auth/login", (error, data) => {
            if(error) {
                this.emitChange();
                return;
            }
            
            this.myProfile = this.transformResponse(data.profile);
            this.emitChange();
        }, formData);

    }


    loadUser(forceFlag) {
        if(!forceFlag) {
            if(typeof this.myProfile !== 'undefined') {
                this.emitChange();
                return;
            }
        }

        if(window.myProfile !== null) {
            this.myProfile = this.transformResponse(window.myProfile);
            window.myProfile = null;
            this.emitChange();
            return;
        }

        this.ajax("get", ApiPrefix + "/profile/me", (error, data) => {
            if(error) {
                this.emitChange();
                return;
            }
            
            this.myProfile = this.transformResponse(data);
            this.emitChange();
        });
    }

    updateMyProfile(data) {
        var _profile = this.getMyProfile();

        this.ajax("put", ApiPrefix + "/profile/"+_profile.id, (error, data) => {
            if(error) {
                return;
            }

            this.myProfile = this.transformResponse(data);
            this.emitChange();
        }, data);
    }

    getLogoutLink() {
        return ApiPrefix + "/auth/logout";
    }

    getMyProfile() {
        var dummyData = {
            id: 0,
            name: "",
            description: "",
            profile_image_url: "/assets/imgs/profile_imageless.png",
        }

        return this.myProfile || dummyData;
    }

    transformResponse(res) {
        res.id = parseInt(res.user_id);
        if(res.profile_image_url.length === 0) {
            res.profile_image_url = "/assets/imgs/profile_imageless.png";
        }
        return res;
    }

}

export default new UserStore();