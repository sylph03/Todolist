import React, { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Settings as SettingsIcon, Shield } from 'lucide-react'
import AccountTab from './AccountTab'

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}

const Settings = () => {
  const location = useLocation()

  const getDefaultTabFromURL = useCallback(() => {
    if (location.pathname.includes(TABS.SECURITY)) return TABS.SECURITY
    return TABS.ACCOUNT
  }, [location.pathname])

  const [activeTab, setActiveTab] = useState(getDefaultTabFromURL())

  useEffect(() => {
    setActiveTab(getDefaultTabFromURL())
  }, [getDefaultTabFromURL])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-sky-600" />
          <h2 className="text-2xl font-bold text-gray-900">Cài đặt</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="flex border-b border-gray-200 px-6">
            <Link
              to="/settings/account"
              className={`px-4 py-4 text-sm font-medium flex items-center gap-2 ${
                activeTab === TABS.ACCOUNT
                  ? 'border-b-2 border-sky-500 text-sky-500'
                  : 'text-gray-500 hover:text-sky-500'
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Tài khoản
            </Link>
            <Link
              to="/settings/security"
              className={`px-4 py-4 text-sm font-medium flex items-center gap-2 ${
                activeTab === TABS.SECURITY
                  ? 'border-b-2 border-sky-500 text-sky-500'
                  : 'text-gray-500 hover:text-sky-500'
              }`}
            >
              <Shield className="w-4 h-4" />
              Bảo mật
            </Link>
          </div>

          <div className="p-6">
            {activeTab === TABS.ACCOUNT && <AccountTab />}
            {activeTab === TABS.SECURITY && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-sky-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Bảo mật</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Đổi mật khẩu</h4>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg hover:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
