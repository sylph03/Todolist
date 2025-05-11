import React, { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { UserCircle, Shield, User } from 'lucide-react'
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'
import AppBar from '~/components/Layout/AppBar'

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
    <div className="h-screen bg-gray-50 dark:bg-gray-700 flex flex-col overflow-hidden">
      <AppBar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <UserCircle className="w-6 h-6 text-sky-600 dark:text-sky-300" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Hồ sơ</h2>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-600">
            <div className="flex border-b border-gray-200 dark:border-gray-600">
              <Link
                to="/settings/account"
                className={`px-5 py-3 text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                  activeTab === TABS.ACCOUNT
                    ? 'border-b-2 border-sky-500 text-sky-500 dark:text-sky-300 dark:border-sky-300'
                    : 'text-gray-500 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-300'
                }`}
              >
                <User className="w-4 h-4" />
                Tài khoản
              </Link>
              <Link
                to="/settings/security"
                className={`px-5 py-3 text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                  activeTab === TABS.SECURITY
                    ? 'border-b-2 border-sky-500 text-sky-500 dark:text-sky-300 dark:border-sky-300'
                    : 'text-gray-500 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-300'
                }`}
              >
                <Shield className="w-4 h-4" />
                Bảo mật
              </Link>
            </div>

            <div className="p-5">
              {activeTab === TABS.ACCOUNT && <AccountTab />}
              {activeTab === TABS.SECURITY && <SecurityTab />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
